import { SpecDefinition } from "../specs/types/spec.types";

export const courseSpec: SpecDefinition = {
  fields: {
    courseId: {
      type: 'string',
      required: true,
      displayOptions: { label: 'Course ID' },
    },
    title: {
      type: 'string',
      required: true,
      displayOptions: { label: 'Title' },
    },
    description: {
      type: 'string',
      displayOptions: { label: 'Description', type: 'textarea' },
    },
    lessons: {
      type: 'array',
      itemType: 'object',
      displayOptions: { label: 'Lessons' },
      fields: {
        lessonId: {
          type: 'string',
          required: true,
          displayOptions: { label: 'Lesson ID' },
        },
        title: {
          type: 'string',
          required: true,
          displayOptions: { label: 'Lesson Title' },
        },
        content: {
          type: 'string',
          displayOptions: { label: 'Content', type: 'textarea' },
        },
        quizzes: {
          type: 'array',
          itemType: 'object',
          displayOptions: { label: 'Quizzes' },
          fields: {
            quizId: {
              type: 'string',
              required: true,
              displayOptions: { label: 'Quiz ID' },
            },
            title: {
              type: 'string',
              required: true,
              displayOptions: { label: 'Quiz Title' },
            },
            questions: {
              type: 'array',
              itemType: 'object',
              displayOptions: { label: 'Questions' },
              fields: {
                questionId: {
                  type: 'string',
                  required: true,
                  displayOptions: { label: 'Question ID' },
                },
                prompt: {
                  type: 'string',
                  required: true,
                  displayOptions: { label: 'Prompt', type: 'textarea' },
                },
                options: {
                  type: 'array',
                  itemType: 'string',
                  displayOptions: { label: 'Options' },
                },
                correctAnswer: {
                  type: 'string',
                  required: true,
                  displayOptions: { label: 'Correct Answer' },
                },
              }
            }
          }
        }
      }
    }
  },
  meta: {
    children: [
      {
        domain: "answer",
        field: {
          parent: "courseId",
          child: "courseId"
        },
        cascadeDelete: true
      }
    ],
    hooks: {
      beforeCreate: async (doc, context) => {
        // Example of beforeCreate hook logic
        console.log(doc, context)
        return doc;
      }
    }
  }
};
