import { ofetch } from 'ofetch'

async function test() {
  const res1 = await ofetch('http://localhost:3000/api/members/directory?page=1&limit=2')
  console.log('Page 1:', res1.pagination)

  const res2 = await ofetch('http://localhost:3000/api/members/directory?page=2&limit=2')
  console.log('Page 2:', res2.pagination)
}

test()
