import { SpecDefinition } from "../specs/types/spec.types";

export const answerSpec: SpecDefinition = {
  fields: {
    answerSheetId: {
      type: 'string',
      required: true,
      displayOptions: { label: 'Answer Sheet ID' },
    },
    studentId: {
      type: 'string',
      required: true,
      displayOptions: { label: 'Student ID' },
    },
    courseId: {
      type: 'string',
      required: true,
      parent: {
        domain: 'course',
        field: 'courseId',
      },
      displayOptions: { label: 'Course ID' },
    },
    answers: {
      type: 'array',
      itemType: 'object',
      displayOptions: { label: 'Answers' },
      fields: {
        questionId: {
          type: 'string',
          required: true,
          parent: {
            domain: 'course',
            field: 'reference', // 🔁 Reference to nested courseSpec questionId
          },
          displayOptions: { label: 'Question ID' },
        },
        selectedOption: {
          type: 'string',
          displayOptions: { label: 'Selected Option' },
        },
        isCorrect: {
          type: 'boolean',
          displayOptions: { label: 'Is Correct?' },
        },
      }
    }
  }
};
