import main from '../../app/reducers/home';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../../app/actions/home';

describe('reducers', () => {
  describe('home', () => {
    it('should handle initial state', () => {
      expect(main(undefined, {})).toMatchSnapshot();
    });

    it('should handle INCREMENT_COUNTER', () => {
      expect(main(1, { type: INCREMENT_COUNTER })).toMatchSnapshot();
    });

    it('should handle DECREMENT_COUNTER', () => {
      expect(main(1, { type: DECREMENT_COUNTER })).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(main(1, { type: 'unknown' })).toMatchSnapshot();
    });
  });
});
