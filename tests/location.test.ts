import {getLocation} from '../src/location'

describe('Location tests', () => {
    test('getLocation returns the correct location', () => {
        expect(getLocation()).toEqual({
            latitude: "45.515050",
            longitude: "-122.648590",
            city: "Portland",
            state: "Oregon",
            county: "Multnomah",
          });
    })
})