// seed-university.ts

import { MongoClient, ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';
import { getCollectionByName } from '../../../../../lib/dbutils';

export const seedDatabase = async (space: string) => {
    console.log('Starting university database seeding...');

    // Clear existing collections
    const db = {
        users: getCollectionByName(space, "users"),
        students: getCollectionByName(space, "students"),
        courses: getCollectionByName(space, "courses"),
        enrollments: getCollectionByName(space, "enrollments"),
        assignments: getCollectionByName(space, "assignments"),
        submissions: getCollectionByName(space, "submissions"),
    }
    await db.users.deleteMany();
    await db.students.deleteMany();
    await db.courses.deleteMany();
    await db.enrollments.deleteMany();
    await db.assignments.deleteMany();
    await db.submissions.deleteMany();
    console.log('Cleared existing data.');

    // --- 1. Populate Users (for instructors) ---
    const usersToCreate = 20;
    const users = [];
    const instructorIds: ObjectId[] = [];
    for (let i = 0; i < usersToCreate; i++) {
        const userId = new ObjectId();
        instructorIds.push(userId);
        users.push({
            _id: userId,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: 'instructor',
            createdAt: faker.date.past(),
        });
    }
    await db.users.insertMany(users);
    console.log(`Created ${users.length} users (instructors).`);

    // --- 2. Populate Students ---
    const studentsToCreate = 1;
    const students = [];
    const studentIds: ObjectId[] = [];
    for (let i = 0; i < studentsToCreate; i++) {
        const studentId = new ObjectId();
        studentIds.push(studentId);
        students.push({
            _id: studentId,
            name: faker.person.fullName(),
            studentId: faker.string.uuid(),
            major: faker.helpers.arrayElement(['Computer Science', 'Mathematics', 'Biology', 'Physics', 'History']),
            createdAt: faker.date.past(),
            contacts: [
                {
                    type: 'email',
                    value: faker.internet.email(),
                    verified: faker.datatype.boolean()
                },
                {
                    type: 'phone',
                    value: faker.phone.number(),
                    verified: faker.datatype.boolean()
                }
            ],
            profile: {
                bio: faker.lorem.paragraph(),
                languages: faker.helpers.arrayElements(['English', 'Spanish', 'Mandarin', 'German', 'French'], faker.number.int({ min: 1, max: 3 })),
                social: {
                    linkedin: faker.internet.url(),
                    github: `https://github.com/${faker.internet.userName().toLowerCase()}`
                }
            }
        });
    }
    await db.students.insertMany(students);
    console.log(`Created ${students.length} students.`);

    // --- 3. Populate Courses ---
    const coursesToCreate = 30;
    const courses = [];
    const courseIds: ObjectId[] = [];
    for (let i = 0; i < coursesToCreate; i++) {
        const courseId = new ObjectId();
        courseIds.push(courseId);
        courses.push({
            _id: courseId,
            title: faker.lorem.words({ min: 2, max: 4 }),
            code: faker.string.alphanumeric({ length: 4 }).toUpperCase() + faker.number.int({ min: 100, max: 499 }),
            credits: faker.helpers.arrayElement([3, 4]),
            instructorId: faker.helpers.arrayElement(instructorIds), // Lookup relationship
            createdAt: faker.date.past(),
        });
    }
    await db.courses.insertMany(courses);
    console.log(`Created ${courses.length} courses.`);

    // --- 4. Populate Enrollments (many-to-many link) ---
    const enrollments = [];
    const enrollmentsToCreate = 2;
    for (let i = 0; i < enrollmentsToCreate; i++) {
        enrollments.push({
            _id: new ObjectId(),
            studentId: faker.helpers.arrayElement(studentIds), // Lookup
            courseId: faker.helpers.arrayElement(courseIds), // Lookup
            enrolledAt: faker.date.recent({ days: 90 }),
        });
    }
    await db.enrollments.insertMany(enrollments);
    console.log(`Created ${enrollments.length} enrollments.`);

    // --- 5. Populate Assignments and Submissions ---
    const assignments = [];
    const submissions = [];

    for (const courseId of courseIds) {
        const assignmentsPerCourse = faker.number.int({ min: 3, max: 8 });
        for (let i = 0; i < assignmentsPerCourse; i++) {
            const assignmentId = new ObjectId();
            assignments.push({
                _id: assignmentId,
                courseId: courseId, // Lookup relationship
                title: faker.lorem.words({ min: 2, max: 5 }),
                dueDate: faker.date.future(),
                maxPoints: faker.number.int({ min: 20, max: 100 }),
            });

            // Populate submissions for this assignment (deeply nested)
            const studentsEnrolledInCourse = enrollments.filter(e => e.courseId.equals(courseId));
            for (const enrollment of studentsEnrolledInCourse) {
                const submissionId = new ObjectId();
                const comments = [];
                const commentsPerSubmission = faker.number.int({ min: 0, max: 3 });
                for (let j = 0; j < commentsPerSubmission; j++) {
                    comments.push({
                        commentText: faker.lorem.sentence(),
                        authorId: faker.helpers.arrayElement(instructorIds),
                        createdAt: faker.date.recent({ days: 7 }),
                    });
                }
                submissions.push({
                    _id: submissionId,
                    assignmentId: assignmentId, // Lookup relationship
                    studentId: enrollment.studentId, // Lookup relationship
                    fileUrl: faker.internet.url(),
                    grade: faker.number.int({ min: 0, max: 100 }),
                    submissionDate: faker.date.recent({ days: 14 }),
                    comments: comments, // Embedded relationship
                });
            }
        }
    }

    await db.assignments.insertMany(assignments);
    console.log(`Created ${assignments.length} assignments.`);
    await db.submissions.insertMany(submissions);
    console.log(`Created ${submissions.length} submissions.`);

    console.log('University database seeding completed successfully!');

    return studentIds;
}
