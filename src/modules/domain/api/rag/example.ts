import { DataTreeSpec } from "./types";

export const universityDataTreeSpec: DataTreeSpec = {
  from: 'students',
  project: ['_id', 'name', 'studentId', 'major', 'createdAt'],
  relationships: [
    {
      as: 'enrollments',
      from: 'enrollments',
      parentField: '_id',
      childField: 'studentId',
      project: ['_id', 'courseId', 'enrolledAt', 'studentId'],
      relationships: [
        {
          as: 'course',
          from: 'courses',
          parentField: 'courseId',
          childField: '_id',
          project: ['_id', 'title', 'code', 'credits', 'instructorId', 'createdAt'],
          relationships: [
            {
              as: 'instructor',
              from: 'users',
              parentField: 'instructorId',
              childField: '_id',
              project: ['_id', 'name', 'email', 'role']
            },
            {
              as: 'assignments',
              from: 'assignments',
              parentField: '_id',
              childField: 'courseId',
              project: ['_id', 'title', 'dueDate', 'maxPoints'],
              relationships: [
                {
                  as: 'submissions',
                  from: 'submissions',
                  parentField: '_id',
                  childField: 'assignmentId',
                  project: [
                    '_id',
                    'studentId',
                    'fileUrl',
                    'grade',
                    'submissionDate',
                    'comments.authorId',
                    'comments.commentText',
                  ],
                  relationships: [
                    {
                      as: 'student',
                      from: 'students',
                      parentField: 'studentId',
                      childField: '_id',
                      project: ['_id', 'name', 'studentId', 'major', 'contacts.value']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
