import { ref } from 'vue'
import type { AbstractSubmission } from '../../types/submissions'

export function useSubmissions() {
  // Mock submissions data
  const submissions = ref<AbstractSubmission[]>([
    {
      id: 1,
      eventId: 1,
      title: 'Impact of COVID-19 on Maternal Health Outcomes in Nigeria',
      abstract:
        'This study examines the effects of the COVID-19 pandemic on maternal health outcomes across Nigeria. We analyzed data from 15 health facilities between March 2020 and December 2022, comparing maternal mortality rates, antenatal care attendance, and birth outcomes before and during the pandemic. Our findings reveal significant disruptions in maternal healthcare services, with a 23% increase in maternal mortality and 35% decrease in skilled birth attendance during peak pandemic periods.',
      authors: ['Dr. Amina Hassan', 'Prof. Chidi Okafor', 'Dr. Fatima Abdullahi'],
      correspondingAuthor: {
        name: 'Dr. Amina Hassan',
        email: 'amina.hassan@unilag.edu.ng',
        affiliation: 'University of Lagos, Department of Public Health',
        phone: '+234 803 123 4567',
      },
      keywords: ['COVID-19', 'maternal health', 'Nigeria', 'pandemic impact'],
      category: 'oral',
      submissionDate: '2024-08-15T10:30:00Z',
      status: 'accepted',
      reviewerComments:
        'Excellent research with significant public health implications. Well-structured methodology and clear presentation of results.',
    },
    {
      id: 2,
      eventId: 1,
      title: 'Epidemiological Trends of Malaria in Northern Nigeria: A 10-Year Analysis',
      abstract:
        'We conducted a comprehensive analysis of malaria epidemiological trends in Northern Nigeria from 2013-2023. Using data from the National Malaria Control Programme and state health ministries, we examined incidence rates, seasonal patterns, and demographic distributions. The study reveals declining overall incidence but persistent hotspots in rural areas, with children under 5 and pregnant women remaining most vulnerable.',
      authors: ['Dr. Musa Ibrahim', 'Dr. Khadija Aliyu'],
      correspondingAuthor: {
        name: 'Dr. Musa Ibrahim',
        email: 'musa.ibrahim@abu.edu.ng',
        affiliation: 'Ahmadu Bello University, Department of Community Medicine',
      },
      keywords: ['malaria', 'epidemiology', 'Nigeria', 'surveillance'],
      category: 'poster',
      submissionDate: '2024-08-20T14:15:00Z',
      status: 'under_review',
    },
    {
      id: 3,
      eventId: 1,
      title: 'Building Capacity in Field Epidemiology: A Training Workshop Proposal',
      abstract:
        'This workshop proposal outlines a comprehensive training program for field epidemiologists in Nigeria. The 2-day intensive workshop will cover outbreak investigation, surveillance systems, data analysis, and communication strategies. Participants will engage in hands-on exercises using real case studies from recent outbreaks. The workshop aims to strengthen the capacity of frontline health workers in epidemic preparedness and response.',
      authors: ['Prof. Adebayo Ogundimu', 'Dr. Grace Nwankwo'],
      correspondingAuthor: {
        name: 'Prof. Adebayo Ogundimu',
        email: 'adebayo.ogundimu@ncdc.gov.ng',
        affiliation: 'Nigeria Centre for Disease Control and Prevention',
      },
      keywords: ['capacity building', 'field epidemiology', 'training', 'outbreak investigation'],
      category: 'workshop',
      submissionDate: '2024-08-25T09:45:00Z',
      status: 'pending',
    },
  ])

  // Check if submissions are open for an event
  const isSubmissionOpen = (eventId: number) => {
    // For now, submissions are open for upcoming events with registration_open status
    const { events } = useEvents()
    const event = events.value.find(e => e.id === eventId)
    if (!event) return false

    const now = new Date()
    const eventStart = new Date(event.startDate)

    return event.status === 'registration_open' && eventStart > now
  }

  // Get submissions for a specific event
  const getEventSubmissions = (eventId: number): AbstractSubmission[] => {
    return submissions.value.filter((s: AbstractSubmission) => s.eventId === eventId)
  }

  // Submit a new abstract
  const submitAbstract = async (
    submission: Omit<AbstractSubmission, 'id' | 'submissionDate' | 'status'>
  ) => {
    const newSubmission: AbstractSubmission = {
      ...submission,
      id: Date.now(),
      submissionDate: new Date().toISOString(),
      status: 'pending',
    }

    submissions.value.push(newSubmission)
    return newSubmission
  }

  // Update submission status (admin function)
  const updateSubmissionStatus = (
    id: number,
    status: AbstractSubmission['status'],
    comments?: string
  ) => {
    const submission = submissions.value.find((s: AbstractSubmission) => s.id === id)
    if (submission) {
      submission.status = status
      if (comments) {
        submission.reviewerComments = comments
      }
    }
  }

  return {
    submissions,
    isSubmissionOpen,
    getEventSubmissions,
    submitAbstract,
    updateSubmissionStatus,
  }
}
