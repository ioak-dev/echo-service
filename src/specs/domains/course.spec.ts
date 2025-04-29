import { SpecDefinition, SpecField } from "../types/spec.types";

// Define the innermost nested level: question inside a quiz
const questionField: SpecField = {
    type: "object",
    schema: {
        fields: {
            questionId: {
                type: "string",
                required: true,
            },
            prompt: {
                type: "string",
                required: true,
            },
            options: {
                type: "array",
                schema: {
                    type: "string",
                },
            },
            correctAnswer: {
                type: "string",
            },
        },
    },
};


// Quiz contains an array of questions
const quizField: SpecField = {
    type: "object",
    schema: {
        fields: {
            quizId: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
            },
            questions: {
                type: "array",
                schema: questionField,
            },
        }
    },
};

// Lesson contains quizzes (array of above)
const lessonField: SpecField = {
    type: "object",
    schema: {
        fields: {
            lessonId: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
            },
            content: {
                type: "string",
            },
            quizzes: {
                type: "array",
                schema: quizField,
            },
        }
    },
};

// Now assemble the full course spec
export const courseSpec: SpecDefinition = {
    fields: {
        courseId: {
            type: "string",
            required: true,
        },
        title: {
            type: "string",
            required: true,
        },
        description: {
            type: "string",
        },
        lessons: {
            type: "array",
            required: true,
            schema: lessonField,
        },
    },
};
