import { Router } from 'express';
import {
  organizationTypeController,
  industryController,
  organizationController,
  countryController,
  currencyController,
  timezoneController,
  dateFormatController,
  languageController
} from '../../controllers/master-data/genericController';

const router = Router();

// Organization Type routes
const orgTypeRouter = Router();
orgTypeRouter.get('/', organizationTypeController.getAll);
orgTypeRouter.get('/:id', organizationTypeController.getById);
orgTypeRouter.post('/', organizationTypeController.create);
orgTypeRouter.put('/:id', organizationTypeController.update);
orgTypeRouter.delete('/:id', organizationTypeController.delete);
orgTypeRouter.patch('/:id/toggle-status', organizationTypeController.toggleStatus);

// Industry routes
const industryRouter = Router();
industryRouter.get('/', industryController.getAll);
industryRouter.get('/:id', industryController.getById);
industryRouter.post('/', industryController.create);
industryRouter.put('/:id', industryController.update);
industryRouter.delete('/:id', industryController.delete);
industryRouter.patch('/:id/toggle-status', industryController.toggleStatus);

// Organization routes
const organizationRouter = Router();
organizationRouter.get('/', organizationController.getAll);
organizationRouter.get('/:id', organizationController.getById);
organizationRouter.post('/', organizationController.create);
organizationRouter.put('/:id', organizationController.update);
organizationRouter.delete('/:id', organizationController.delete);
organizationRouter.patch('/:id/toggle-status', organizationController.toggleStatus);

// Country routes
const countryRouter = Router();
countryRouter.get('/', countryController.getAll);
countryRouter.get('/:id', countryController.getById);
countryRouter.post('/', countryController.create);
countryRouter.put('/:id', countryController.update);
countryRouter.delete('/:id', countryController.delete);
countryRouter.patch('/:id/toggle-status', countryController.toggleStatus);

// Currency routes
const currencyRouter = Router();
currencyRouter.get('/', currencyController.getAll);
currencyRouter.get('/:id', currencyController.getById);
currencyRouter.post('/', currencyController.create);
currencyRouter.put('/:id', currencyController.update);
currencyRouter.delete('/:id', currencyController.delete);
currencyRouter.patch('/:id/toggle-status', currencyController.toggleStatus);

// Timezone routes
const timezoneRouter = Router();
timezoneRouter.get('/', timezoneController.getAll);
timezoneRouter.get('/:id', timezoneController.getById);
timezoneRouter.post('/', timezoneController.create);
timezoneRouter.put('/:id', timezoneController.update);
timezoneRouter.delete('/:id', timezoneController.delete);
timezoneRouter.patch('/:id/toggle-status', timezoneController.toggleStatus);

// Date Format routes
const dateFormatRouter = Router();
dateFormatRouter.get('/', dateFormatController.getAll);
dateFormatRouter.get('/:id', dateFormatController.getById);
dateFormatRouter.post('/', dateFormatController.create);
dateFormatRouter.put('/:id', dateFormatController.update);
dateFormatRouter.delete('/:id', dateFormatController.delete);
dateFormatRouter.patch('/:id/toggle-status', dateFormatController.toggleStatus);

// Language routes
const languageRouter = Router();
languageRouter.get('/', languageController.getAll);
languageRouter.get('/:id', languageController.getById);
languageRouter.post('/', languageController.create);
languageRouter.put('/:id', languageController.update);
languageRouter.delete('/:id', languageController.delete);
languageRouter.patch('/:id/toggle-status', languageController.toggleStatus);

// Mount sub-routers
router.use('/organization-types', orgTypeRouter);
router.use('/industries', industryRouter);
router.use('/organizations', organizationRouter);
router.use('/countries', countryRouter);
router.use('/currencies', currencyRouter);
router.use('/timezones', timezoneRouter);
router.use('/date-formats', dateFormatRouter);
router.use('/languages', languageRouter);

export default router;
