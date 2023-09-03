import assert from 'assert'
import registrationApp from '../services/registrationApp.js'

describe('registration_numbers', function () {

    it('Should display registration for Cape Town', function () {

        let Registration = registrationApp();
        Registration.setDisplayRegistration("CA 98765");

        assert.equal("CA 98765", Registration.getDisplayRegistration());

    });

    it('Should display registration for Johannesburg', function () {

        let Registration = registrationApp();
        Registration.setDisplayRegistration("CZH 182 GP");

        assert.equal("CZH 182 GP", Registration.getDisplayRegistration());

    });

    it('Should display registration for Durban', function () {

        let Registration = registrationApp();
        Registration.setDisplayRegistration("ND 98765");

        assert.equal("ND 98765", Registration.getDisplayRegistration());


    });

    it('Should display registration for Polokwane', function () {

        let Registration = registrationApp();
        Registration.setDisplayRegistration("BCC 230 L");

        assert.equal("BCC 230 L", Registration.getDisplayRegistration());

    });

});