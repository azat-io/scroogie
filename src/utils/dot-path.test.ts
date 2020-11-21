import { dotPath } from '.'

const object = {
  person: {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    age: 36,
  },
  admin: false,
}

test('Test dotPath helper', () => {
  expect(dotPath('person.name.firstName', object)).toBe('John')
  expect(dotPath('person.age', object)).toBe(36)
  expect(dotPath('admin', object)).toBe(false)
})
