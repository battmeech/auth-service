import { ErrorResponse } from '../errorResponse';

describe('Tests of the error response model', () => {
    it('Successfully instantiates a new error model', () => {
        // Setup
        const error = new ErrorResponse(
            404,
            'Not found',
            'Did not find the thing'
        );

        // Assert
        expect(error.status).toStrictEqual(404);
        expect(error.message).toStrictEqual('Not found');
        expect(error.details).toStrictEqual('Did not find the thing');
    });
});
