import {
  MutationCreateBlogArgs,
  MutationDeleteBlogArgs,
  MutationUpdateBlogArgs,
} from '@/interfaces/graphql/generated/graphql'
import { arrToGqlStr } from '@/lib/util'
const createBlog = ({ input }: MutationCreateBlogArgs) => `
  mutation {
    createBlog(input: {
      title: "${input.title}",
      body: "${input.body}",
      status: ${input.status},
      createdBy: {
        id: "${input.createdBy.id}",
        name: "${input.createdBy.name}",
      }
      tags: ${arrToGqlStr(input.tags)}
    }) {
      id
      title
      body
      created_at
      status
      createdBy {
        id
        name
      }
    }
  }
`

const updateBlog = ({ id, input }: MutationUpdateBlogArgs) => `
  mutation {
    updateBlog(id: "${id}", input: {
      title: "${input.title}",
      body: "${input.body}",
      status: ${input.status},
      createdBy: {
        id: "${input.createdBy.id}",
        name: "${input.createdBy.name}",
      }
      tags: ${arrToGqlStr(input.tags)}
    }) {
      id
      title
      body
      created_at
      status
      createdBy {
        id
        name
      }
    }
  }
`

const deleteBlog = ({ id }: MutationDeleteBlogArgs) => `
  mutation {
    deleteBlog(id: "${id}") {
      id
      title
      body
      created_at
      status
      createdBy {
        id
        name
      }
    }
  }
`

const blogMutation = {
  createBlog,
  updateBlog,
  deleteBlog,
}

export default blogMutation
