### graphql 基本使用

- 定义 schema
- 定义 resolver
- 查询

```js
const { graphql, buildSchema } = require("graphql");

// 定义schema 需要有一个查询入口query
const schema = buildSchema(`
        type Query {
            foo: String
            count: Int
        }
    `);
// 定义schema的 resolver 名称和上面的schema对应 且返回类型要一致
const rootValue = {
  foo() {
    return "bar";
  },
  count() {
    return 123;
  },
};
// 查询
graphql(schema, "{count, foo}", root).then((res) => {
  console.log(res);
});
```

### 结合 express 使用

**服务端代码**

```js
    const {buildSchema} = require('graphql')
    const express = require('express)
    const {graphqlHTTP} = require('express-graphql')

    const cors = require('cors')

    const app = express()
    // 允许跨域
    app.use(cors())

    // schema
    const schema = buildSchema(`
        type Query {
            foo: String
            count: Int
        }
    `)
    // 定义 schema的resolver
    const rootValue = {
        foo() {
            return 'bar'
        },
        count() {
            return 123
        }
    }
    // 挂载GraphQL 中间件
    app.use('/graphql', graphqlHTTP({
        schema,
        rootValue,
        graphiql: true // 开启浏览器 GraphQL IDE 调试工具
    }))

    // 启动web服务
    app.listen(4000, () => {
        console.log('listening at 4000')
    })
```

**客户端代码**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      axios({
        method: "POST", // GraphQL 的请求方法必须是POST
        url: "http://localhost:4000/graphql",
        data: {
          query: "{foo, count}",
        },
      }).then((res) => {
        console.log(res);
      });
    </script>
  </body>
</html>
```

### schema 的各种类型

```js
// ...
const schema = buildSchema(`
        # Query 严格来说是一种对象类型
        # Query 是所有查询的入口点
        # Query 必须有， 并且不能重复
        type Query {
            # 默认情况下，每个类型都是可以为空的
            # 在类型后面加 ! 表示该字段不能为null
            foo: String!
            count: Int
            salary: Float
            isGood: Boolean
            userId: ID # 唯一标识
            user: User # 对象类型
            article: Article
        }

        type User {
            name: String
            age: Int
            hobbies: [String!]!
            scores: [Score]
            gender: Gender
        }
        
        type Score {
            name: String
            score: Float
        }
        # 枚举类型
        type Gender {
            MALE
            FEMAIL
        }

        type Article {
            title: String
            body: String
            author: User
        }
    `);

// 定义schema的resolver

const rootValue = {
  foo() {
    return "bar";
  },
  count() {
    return 123;
  },
  salary() {
    return 123.123;
  },
  isGood() {
    return true;
  },
  userId() {
    return 123;
  },
  user() {
    return {
      name: "Jack",
      age: 18,
      hobbies: ["吃饭", "睡觉"],
      scores: [
        { name: "英语", score: 78 },
        { name: "数学", score: 98 },
      ],
      gender: "MALE",
    };
  },
  article() {
    return {
      title: "标题",
      body: "内容",
      author: {
        name: "Jack",
        age: 18,
      },
    };
  },
};
```

### CURD 的定义及使用

**服务端代码**

```js
const { buildSchema } = require("graphql");
const express = require("express");

const { graphqlHTTP } = require("express-graphql");

const cors = require("cors");

const { v4: uuidv4 } = require("uuid"); // 唯一标识

const app = express();

app.use(cors());

const articles = [
  { id: "1", title: "article 1", body: "article 1 body" },
  { id: "2", title: "article 2", body: "article 2 body" },
  { id: "3", title: "article 3", body: "article 3 body" },
];

const schema = buildSchema(`
        type Article {
            id: ID!
            title: String!
            body: String!
            tagList: [String!]
        }

        # 查询的入口点
        type Query {
            articles: [Article]
            article(id: ID!): Article # 带查询参数id的article
        }
        # 参数对象必须使用Input 定义
        input CreateArticleInput {
            title: String!
            body: String!
            tagList: [String!]
        }
        input UpdateArticleInput {
            title: String!
            body: String!
        }
        type DeletionStatus {
            success: Boolean!
        }

        # 修改入口点
        type Mutation {
            createArticle(article: CreateArticleInput): Article
            updateArticle(id: ID!, article: UpdateArticleInput): Article
            deleteArticle(id: ID!): DeletionStatus
        }
    `);

    const rootValue = {
        articles() {
            return articles
        },
        article({id}) {
            return articles.find(article => article.id === id)
        },
        createArticle({article}) {
            article.id = uuidv4()
            articles.push(article)
            return article
        },
        updateArticle({id, article: postArticle}) {
            const article = articles.find(article => article.id === id)
            article.title = postArticle.title
            article.body = postArticle.body
            return article
        },
        deleteArticle({id}) {
           const index = articles.findIndex(article => article.id === id)
           articles.splice(index, 1)

           return {
               sucess: true
           }
        }

        app.use('/graphql', graphqlHTTP({
            schema,
            rootValue,
            graphiql: true
        }))

        app.listen(4000, () => {
        console.log('GraphQL Server is running at http://localhost:4000/')
        })


    }
```

**客户端代码**

```html
<script>
  // 获取文章列表
  axios({
    method: "POST",
    url: "http://localhost:4000/graphql",
    data: {
      query: `
                query getArticles {
                    articles {
                        title
                    }
                }
               `,
    },
  }).then((res) => {
    console.log(res.data);
  });

  // 获取单个文章
  const id = 1;
  axios({
    method: "POST",
    url: "http://localhost:4000/graphql",
    data: {
      query: `
                query getArticles {
                    article(id: ${id}) {
                        title
                        id
                    }
                }
               `,
    },
  }).then((res) => {
    console.log(res.data);
  });

  // 另外一种传递参数的方式
  axios({
    method: "POST",
    url: "http://localhost:4000/graphql",
    data: {
      query: `
                query getArticles($id: ID!) {
                    article(id: $id) {
                        title
                        id
                    }
                }
               `,
      variables: {
        id: 2,
      },
    },
  }).then((res) => {
    console.log(res.data);
  });

  // 创建文章
  axios({
    method: "POST",
    url: "http://localhost:4000/graphql",
    data: {
      query: `
                 mutation createArticle($article: CreateArticleInput) {
                     createArticle(article: $article) {
                         id
                         title
                         body
                     }
                 }
               `,
      variables: {
        article: {
          title: "aaa",
          body: "bbb",
        },
      },
    },
  }).then((res) => {
    console.log(res.data);
  });

  // 更新文章
  axios({
    method: "POST", // GraphQL 的请求方法必须是 POST
    url: "http://localhost:4000/graphql",
    data: {
      query: `
            mutation updateArteicle($id: ID!, $article: UpdateArticleInput) {
                updateArticle(id: $id, article: $article) {
                id
                title
                body
                }
            }
            `,
      variables: {
        id: 2,
        article: {
          title: "aaa",
          body: "bbb",
        },
      },
    },
  }).then((res) => {
    console.log(res.data);
  });

  // 删除文章
  axios({
    method: "POST", // GraphQL 的请求方法必须是 POST
    url: "http://localhost:4000/graphql",
    data: {
      query: `
                mutation deleteArteicle($id: ID!) {
                    deleteArticle(id: $id) {
                    success
                    }
                }
                `,
      variables: {
        id: 2,
      },
    },
  }).then((res) => {
    console.log(res.data);
  });
</script>
```

### apollo-server

```js
const {ApolloServer, gql} = require('apollo-server')

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
    type Query {
        books: [book]
    }
`
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  }
]

const resolver = {
    Query: {
        books: () => books
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})

```

### apollo-server集成express

**resolver的args参数**

```js
const express = require('express')

const { ApolloServer, gql } = require('apollo-server-express')

// 1. 定义 schema
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type User {
    id: ID!
    name: String
  }

  type Query {
    books: [Book]
    numberSix: Int! # Should always return the number 6 when queried
    numberSeven: Int! # Should always return 7
    user(id: ID!, foo: String): User
  }
`

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  }
]

const users = [
  {
    id: '1',
    name: 'Elizabeth Bennet'
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy'
  }
]

// 2. 定义 resolver
const resolvers = {
  // 所有的 Query 都走这里
  Query: {
    books: () => books,
    numberSix() {
      return 6
    },
    numberSeven() {
      return 7
    },
    // args: 客户端的查询参数
    user(parent, args, context, info) {
      console.log(args)
      return users.find(user => user.id === args.id);
    }
  }
}

const app = express()

const server = new ApolloServer({ typeDefs, resolvers })

// 将 Apollo-server 和 express 集合到一起
server.applyMiddleware({ app })

app.use((req, res) => {
  res.status(200)
  res.send('Hello!')
  res.end()
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)


```

**context参数及resolver链**

```js
    const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

// 1. 定义 schema
const typeDefs = gql`
  # A library has a branch and books
  type Library {
    branch: String!
    books: [Book!]
  }

  # A book has a title and author
  type Book {
    title: String!
    author: Author!
  }

  # An author has a name
  type Author {
    name: String!
  }

  type Query {
    libraries: [Library]
  }
`

const users = [
  {
    id: '1',
    name: 'Elizabeth Bennet'
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy'
  }
]

const libraries = [
  {
    branch: 'downtown'
  },
  {
    branch: 'riverside'
  }
]

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown'
  }
]

// 2. 定义 resolver
const resolvers = {
  // 所有的 Query 都走这里
  Query: {
    libraries(parent, args, context) {
      console.log(context)
      // Return our hardcoded array of libraries
      return libraries
    }
  },
  Library: {
    // 这些解析器按上述顺序执行，并将其返回值通过父参数传递给链中的下一个解析器。
    books(parent, args, context) {
      console.log(context)
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter(book => book.branch === parent.branch)
    },
  },
  Book: {
    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        name: parent.author
      }
    }
  }
}

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // 任何 GraphQL 请求都会经过这里
  // 该函数接收一个参数：Request 请求对象
  context (req) {
    return { // 返回对象，自定义数据，后续的每个 resolver 都可以直接获取
      foo: 'bar'
    }
  }
})

// 将 Apollo-server 和 express 集合到一起
server.applyMiddleware({ app })

app.use((req, res) => {
  res.status(200)
  res.send('Hello!')
  res.end()
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)


```

### 在数据库中使用

```js
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { User } = require('./models/')
const Users = require('./data-sources/user')

// 1. 定义 schema
const typeDefs = gql`
  type User {
    _id: ID!,
    name: String!,
    age: Int
  }

  type Query {
    users: [User!]
    user(id: ID!): User
  }
`

// 2. 定义 resolver
const resolvers = {
  // 所有的 Query 都走这里
  Query: {
    async users (parent, args, { dataSources }) {
      const users = await dataSources.users.getUsers()
      return users
    },
    async user (parent, { id }, { dataSources }) {
      const user = await dataSources.users.getUser(id)
      return user
    }
    // async users () {
    //   const users = await User.find()
    //   return users
    // },
    // async user (parent, { id }) {
    //   const user = await User.findById(id)
    //   return user
    // }
  }
}

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // 任何 GraphQL 请求都会经过这里
  // 该函数接收一个参数：Request 请求对象
  context (req) {
    return { // 返回对象，自定义数据，后续的每个 resolver 都可以直接获取
      foo: 'bar'
    }
  },
  dataSources () {
    return {
      users: new Users(User)
    }
  }
})

// 将 Apollo-server 和 express 集合到一起
server.applyMiddleware({ app })

app.use((req, res) => {
  res.status(200)
  res.send('Hello!')
  res.end()
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

```
