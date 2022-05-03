const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type RootQuery {
    me: userInfo!
}

type userInfo {
    _id: ID!
    name: String!
    email: String!
}

type outputUserData {
    _id: ID!
    name: String!
    email: String!
    catogaries: [String!]
}

input inputUserData {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
}

type outputUserLoginData {
    _id: ID!
    name: String!
    email: String!
    token: String!
}

input inputUserLoginData {
    email: String!
    password: String!
}

input inputTaskInfo {
    task: String!
    start: String!
    end: String!
    catagory: String!
}

type outputTaskInfo {
    _id: ID!
    userId: String!
}

input inputDeleteTaskInfo {
    taskId: ID!
}

input inputEditTaskInfo {
    taskId: ID!
    taskValue: String!
    start: String!
    end: String!
}

type outputEditTaskInfo {
    task: String!
    start: String!
    end: String!
}

input inputAddCatogaryInfo {
    userId: ID!
    catogary: String!
}

type outputAddCatogaryInfo {
    _id: ID!
    catogaries: [String!]
}

type RootMutation {
    SignUp(userData: inputUserData): outputUserData!
    LogIn(userLoginData: inputUserLoginData): outputUserLoginData!
    createTask(taskInfo: inputTaskInfo): outputTaskInfo!
    deleteTask(deleteTaskInfo: inputDeleteTaskInfo): String!
    eidtTask(editTaskInfo: inputEditTaskInfo): outputEditTaskInfo!
    addCatogary(addCatogaryInfo: inputAddCatogaryInfo): outputAddCatogaryInfo!

}

schema {
    query: RootQuery
    mutation: RootMutation
}

`)
