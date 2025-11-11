import { Router } from 'express';

const router = Router();

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

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Get ticket ${req.params.id} endpoint - to be implemented`,
  });
});

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