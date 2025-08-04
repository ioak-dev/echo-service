import { ChunkSpec, DataTreeSpec } from "../types";

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

export const universityChunkSpecs: ChunkSpec[] = [
  //   {
  //     subjectPath: 'students.*',
  //     embeddingTemplate: 'Student {{courseId}} {{name}} is majoring in {{major}}.',
  //     metadata: { type: 'student' },
  //     denormalizeChildren: true
  //   },
  //   {
  //     subjectPath: 'students.*.enrollments.*',
  //     embeddingTemplate: `Student: {{tree.students.name}}
  //     Course: {{tree.students.enrollments.course.title}}
  //     Enrolled Courses:
  // {{#each childContext.enrollments}}
  //   {{#each course}}
  //     - {{title}}
  //   {{/each}}
  // {{/each}}`,
  //     metadata: { type: 'enrollment' },
  //     denormalizeChildren: true
  //   },
  // {
  //   subjectPath: 'students.*.enrollments.*',
  //   embeddingTemplate: 'Course {{tree.students.enrollments.course.title}}.',
  //   metadata: { type: 'course' }
  // },
  // {
  //   subjectPath: 'students.*.enrollments.*.course.*',
  //   embeddingTemplate: 'Course {{tree.students.enrollments.course.title}}.',
  //   metadata: { type: 'course' }
  // },
  // {
  //   subjectPath: 'students.*.enrollments.*.course.*.instructor.*',
  //   embeddingTemplate: 'Course {{tree.students.enrollments.course.title}}.',
  //   metadata: { type: 'course' }
  // },
  // {
  //   subjectPath: 'students.*.enrollments.*.course.instructor',
  //   subjectTemplate: 'Instructor {{this.name}} ({{this.email}}) is responsible for teaching.',
  //   parentContextTemplate: 'Course title: {{ancestors.[0].title}}',
  //   metadata: { type: 'instructor' }
  // },
  {
    subjectPath: 'students.*.enrollments.*.course.*.assignments.*',
    embeddingTemplate: 'Assignment "{{tree.students.enrollments.course.assignments.title}}"',
    metadata: { type: 'assignment' }
  },
  // {
  //   subjectPath: 'students.*.enrollments.*.course.assignments.*.submissions.*',
  //   subjectTemplate: 'Submission by student ID {{this.studentId}} on {{this.submissionDate}}. Grade: {{this.grade}}.',
  //   parentContextTemplate: 'Assignment: {{ancestors.[0].title}}',
  //   childContextTemplate: '{{#each this.comments}}Comment: {{this.commentText}} by {{this.authorId}}\n{{/each}}',
  //   metadata: { type: 'submission' }
  // },
  // {
  //   subjectPath: 'students.*.enrollments.*.course.assignments.*.submissions.*.student',
  //   subjectTemplate: 'Submitted by {{this.name}} ({{this.studentId}}), major: {{this.major}}.',
  //   parentContextTemplate: 'Submission Date: {{ancestors.[0].submissionDate}}',
  //   metadata: { type: 'submissionAuthor' }
  // }
];
