import type { Submission } from '@/types';

// Sample data for the frontend only. This gets replaced by real website
// submissions once the backend is connected.
const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    type: 'help',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+919876543210',
    subject: 'Injured stray dog near market',
    message:
      'There is an injured stray dog near the main market. Its back leg looks hurt and it cannot walk properly. Please send help as soon as possible.',
    location: 'Ahmedabad, Gujarat',
    createdAt: hoursAgo(0.5),
    status: 'new',
  },
  {
    id: '2',
    type: 'contact',
    name: 'James Miller',
    email: 'james.miller@example.com',
    phone: '+14155550123',
    subject: 'Volunteering opportunities',
    message:
      'Hi, I would love to volunteer with your foundation on weekends. Please let me know how I can get involved.',
    createdAt: hoursAgo(3),
    status: 'new',
  },
  {
    id: '3',
    type: 'help',
    name: 'Rahul Patel',
    email: 'rahul.p@example.com',
    phone: '+919812345678',
    subject: 'Cat stuck on rooftop',
    message: 'A kitten has been stuck on our building rooftop since yesterday and keeps crying.',
    location: 'Surat, Gujarat',
    createdAt: hoursAgo(8),
    status: 'in_progress',
    notes: 'Called back, rescue team visiting at 5 PM.',
  },
  {
    id: '4',
    type: 'contact',
    name: 'Sara Ahmed',
    email: 'sara.ahmed@example.com',
    subject: 'Donation receipt',
    message: 'I donated last month but have not received my receipt yet. Could you please resend it?',
    createdAt: hoursAgo(26),
    status: 'done',
  },
  {
    id: '5',
    type: 'help',
    name: 'Daniel Brooks',
    email: 'd.brooks@example.com',
    phone: '+447700900123',
    subject: 'Abandoned puppies',
    message: 'Found 4 puppies abandoned in a box outside our office. They look weak and hungry.',
    location: 'Manchester, UK',
    createdAt: hoursAgo(50),
    status: 'done',
  },
  {
    id: '6',
    type: 'contact',
    name: 'Meera Joshi',
    email: 'meera.j@example.com',
    phone: '+919900112233',
    subject: 'School awareness program',
    message: 'Our school would like to host an animal welfare awareness session. Are you available next month?',
    createdAt: hoursAgo(72),
    status: 'in_progress',
  },
];
