var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL schema
// consists of a custom type Course and two query actions
// defined query actions enable the user to
// retrieve a single course by ID or
// an array of courses by topic

// the schema also contains a Mutation type
// the Mutation type is named updateCourseTopic (contains two required params)
// the return type is after the colon. The return type is of type Course
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

// dummy course data
var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var getCourse = function(args) { 
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
  coursesData.map(course => {
      if (course.id === id) {
          course.topic = topic;
          return course;
      }
  });
  return coursesData.filter(course => course.id === id) [0];
}

// connecting the course query action to the getCourse function and
// connecting the courses query action to the getCourses function
var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};


/////// Sample query code
// the exclamation mark at the end of the parameter means it's required
// you supply this parameter in the Query variables text area of the graphQL IDE

// query getSingleCourse($courseID: Int!) {
//   course(id: $courseID) {
//       title
//       author
//       description
//       topic
//       url
//   }
// }


// can include multiple queries in one request
// course1 and course2 are aliases to distinguish between queries,
// and will return like that in the response

// query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
//   course1: course(id: $courseID1) {
//          ...courseFields
//   },
//   course2: course(id: $courseID2) {
//         ...courseFields
//   } 
// }

// fragment courseFields on Course {
//   title
//   author
//   description
//   topic
//   url
// }

/////// Mutation example
// mutation keyword followed by the name of the operation

// mutation updateCourseTopic($id: Int!, $topic: String!) {
//   updateCourseTopic(id: $id, topic: $topic) {
//     ... courseFields
//   }
// }


// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));