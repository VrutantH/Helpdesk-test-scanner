import { Router } from 'express';
import { submitTicket, upload, getMyTickets, getTicketById, replyToTicket, closeTicket, getAgentAssignedTickets } from '../controllers/ticketController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// @desc    Submit ticket from student portal
// @route   POST /api/tickets/submit
// @access  Public
// Accept any file field names from the student portal (we'll map files by their fieldnames in the controller)
router.post('/submit', upload.any(), submitTicket);

// @desc    Get tickets for logged-in student
// @route   GET /api/tickets/my-tickets
// @access  Private (Student)
router.get('/my-tickets', authMiddleware, getMyTickets);

// @desc    Get tickets assigned to logged-in agent
// @route   GET /api/tickets/agent/assigned
// @access  Private (Agent)
router.get('/agent/assigned', authMiddleware, getAgentAssignedTickets);

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get tickets endpoint - to be implemented',
  });
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create ticket endpoint - to be implemented',
  });
});

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private (Student)
router.get('/:id', authMiddleware, getTicketById);

// @desc    Add reply to ticket
// @route   POST /api/tickets/:id/reply
// @access  Private (Student)
router.post('/:id/reply', authMiddleware, upload.any(), replyToTicket);

// @desc    Close ticket
// @route   PATCH /api/tickets/:id/close
// @access  Private (Student)
router.patch('/:id/close', authMiddleware, closeTicket);

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Update ticket ${req.params.id} endpoint - to be implemented`,
  });
});

export default router;