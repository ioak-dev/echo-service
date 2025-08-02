import { DataTreeSpec } from "./types";

export const universityDataTreeSpec: DataTreeSpec = {
  collection: 'students',
  project: ['_id', 'name', 'studentId', 'major', 'createdAt'],
  relationships: [
    {
      name: 'enrollments',
      from: 'enrollments',
      localField: '_id',
      foreignField: 'studentId',
      spec: {
        collection: 'enrollments',
        project: ['_id', 'courseId', 'enrolledAt', 'studentId'],
        relationships: [
          {
            name: 'course',
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            spec: {
              collection: 'courses',
              project: ['_id', 'title', 'code', 'credits', 'instructorId', 'createdAt'],
              relationships: [
                {
                  name: 'instructor',
                  from: 'users',
                  localField: 'instructorId',
                  foreignField: '_id',
                  spec: {
                    collection: "users",
                    project: ['_id', 'name', 'email', 'role']
                  }
                },
                {
                  name: 'assignments',
                  from: 'assignments',
                  localField: '_id',
                  foreignField: 'courseId',
                  spec: {
                    collection: 'assignments',
                    project: ['_id', 'title', 'dueDate', 'maxPoints'],
                    relationships: [
                      {
                        name: 'submissions',
                        from: 'submissions',
                        localField: '_id',
                        foreignField: 'assignmentId',
                        spec: {
                          collection: 'submissions',
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
                              name: 'student',
                              from: 'students',
                              localField: 'studentId',
                              foreignField: '_id',
                              spec: {
                                collection: 'student',
                                project: ['_id', 'name', 'studentId', 'major', 'contacts.value']
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
