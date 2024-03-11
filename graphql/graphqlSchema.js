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
    task: String!
}

input inputGetTaskInfo {
    userId: ID!
    catogary: String!
    showCompletedTask: Boolean!
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
}

type outputEditTaskInfo {
    task: String!
}
input inputCompleteTaskInfo {
    taskId: ID!
    state: Boolean!
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

type OTPType {
    message: String!
}

type RootMutation {
    SignUp(userData: inputUserData): outputUserData!
    LogIn(userLoginData: inputUserLoginData): outputUserLoginData!
    createTask(taskInfo: inputTaskInfo): outputTaskInfo!
    getTask(getTaskInfo: inputGetTaskInfo): [outputGetTaskInfo!]
    deleteTask(deleteTaskInfo: inputDeleteTaskInfo): String!
    editTask(editTaskInfo: inputEditTaskInfo): outputEditTaskInfo!
    completeTask(completeTaskInfo: inputCompleteTaskInfo): String!
    addCatogary(addCatogaryInfo: inputAddCatogaryInfo): outputAddCatogaryInfo!
    deleteCatogary(deleteCatogaryInfo: inputDeleteCatogaryInfo): outputDeleteProject!
    sendOTP(email: String!): OTPType!
}


schema {
    query: RootQuery
    mutation: RootMutation
}

`)
