import { SpecDefinition } from "../specs/types/spec.types";

export const enrollmentSpec: SpecDefinition = {
  fields: {
    enrollmentId: {
      type: 'string',
      required: true,
      displayOptions: { label: 'Enrollment ID' },
    },
    studentName: {
      type: 'string',
      required: true,
      displayOptions: { label: 'Student Name' },
    },
    courseId: {
      type: 'string',
      required: true,
      parent: {
        domain: 'course',       // <-- foreign domain reference
        field: 'courseId',      // <-- field in the referenced domain
      },
      displayOptions: { label: 'Course ID (Reference)' },
    },
    enrollmentDate: {
      type: 'string',
      displayOptions: { label: 'Enrollment Date' },
    },
    status: {
      type: 'enum',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Dropped', value: 'dropped' },
      ],
      displayOptions: { label: 'Enrollment Status' },
    },
  },
  meta: {
    // You can also declare child relationships here if needed
    // children: [{ domain: 'progress', field: 'enrollmentId' }]
  }
};
