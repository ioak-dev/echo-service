import { DataTreeSpec, LookupRelationship } from "./types";

export const universityDataTreeSpec: DataTreeSpec = {
    rootCollection: 'students',
    project: ['_id', 'name', 'studentId', 'major'],
    relationships: [
        // Nested relationship to get the courses a student is enrolled in
        {
            as: 'enrollments',
            relationshipType: 'lookup',
            collection: 'enrollments', // Use a join collection for many-to-many
            fromField: 'studentId',
            localField: '_id',
            // project: ["studentId"],
            nestedSpec: {
                relationships: [
                    // Lookup from the enrollment to the actual course details
                    {
                        as: 'courses',
                        relationshipType: 'lookup',
                        collection: 'courses',
                        fromField: '_id',
                        localField: 'courseId',
                        nestedSpec: {
                            project: ['title', 'code', 'credits'],
                            relationships: [
                                // Lookup to get the instructor for the course
                                {
                                    relationshipType: 'lookup',
                                    as: 'users',
                                    collection: 'users',
                                    fromField: '_id',
                                    localField: 'instructorId',
                                    project: ['name', 'email'],
                                } as LookupRelationship,

                                // Deeply nested relationship to get assignments for this course
                                {
                                    as: 'assignments',
                                    relationshipType: 'lookup',
                                    collection: 'assignments',
                                    fromField: 'courseId',
                                    localField: '_id',
                                    nestedSpec: {
                                        project: ['title', 'dueDate', 'maxPoints'],
                                        relationships: [
                                            // Nested relationship to get submissions for this assignment, filtered by the current student
                                            {
                                                as: 'submissions',
                                                relationshipType: 'lookup',
                                                collection: 'submissions',
                                                fromField: 'assignmentId',
                                                localField: '_id',
                                                nestedSpec: {
                                                    project: ['grade', 'submissionDate', 'fileUrl'],
                                                    relationships: [
                                                        // Embedded relationship for comments on the submission
                                                        {
                                                            relationshipType: 'embedded',
                                                            as: 'comments',
                                                            localField: 'comments',
                                                            collection: 'submissions', // A dummy collection name, as it's an embedded array
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};
