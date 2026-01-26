const { validateRequest } = require('../../../middlewares/validation');
const AppError = require('../../../errors/AppError');

// Mock express-validator at module level
jest.mock('express-validator', () => ({
  body: jest.fn(),
  validationResult: jest.fn()
}));

const { validationResult } = require('express-validator');

describe('Validation Middleware', () => {
  describe('validateRequest', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {};
      next = jest.fn();
      jest.clearAllMocks();
    });

    it('should call next() when there are no validation errors', () => {
      // Mock validationResult to return empty errors
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });

      validateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    it('should throw AppError when there are validation errors', () => {
      const errors = [
        { path: 'email', msg: 'validation.email.invalid', value: 'bademail' },
        { path: 'password', msg: 'validation.password.length', value: '123' }
      ];

      // Mock validationResult to return errors
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors
      });

      expect(() => {
        validateRequest(req, res, next);
      }).toThrow(AppError);

      expect(next).not.toHaveBeenCalled();
    });

    it('should format validation errors correctly', () => {
      const errors = [
        { path: 'email', msg: 'validation.email.invalid', value: 'bademail' }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors
      });

      try {
        validateRequest(req, res, next);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('validation_failed');
        expect(error.details).toEqual([
          {
            field: 'email',
            message: 'validation.email.invalid',
            value: 'bademail'
          }
        ]);
      }
    });
  });
});
