const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type RootQuery {
    me: outputUserData!
}

type outputUserData {
    _id: ID!
    name: String!
    email: String!
    catogaries: [String!],
    message: String!
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
    token: String!,
    catogaries: [String!]
}

input inputUserLoginData {
    email: String!
    password: String!
}

input inputTaskInfo {
    task: String!
    catagory: String!
}

type outputTaskInfo {
    _id: ID!
    userId: String!
}

input inputGetTaskInfo {
    userId: ID!
    catogary: String!
}

type outputGetTaskInfo {
    id: ID!
    task: String!
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

input inputDeleteCatogaryInfo {
    projectId: ID!
    projectName: String!
}
type outputDeleteProject {
    catogaries: [String!]
    message: String!
}

type RootMutation {
    SignUp(userData: inputUserData): outputUserData!
    LogIn(userLoginData: inputUserLoginData): outputUserLoginData!
    createTask(taskInfo: inputTaskInfo): outputTaskInfo!
    getTask(getTaskInfo: inputGetTaskInfo): [outputGetTaskInfo!]
    deleteTask(deleteTaskInfo: inputDeleteTaskInfo): String!
    eidtTask(editTaskInfo: inputEditTaskInfo): outputEditTaskInfo!
    addCatogary(addCatogaryInfo: inputAddCatogaryInfo): outputAddCatogaryInfo!
    deleteCatogary(deleteCatogaryInfo: inputDeleteCatogaryInfo): outputDeleteProject!
}

schema {
    query: RootQuery
    mutation: RootMutation
}

`)
