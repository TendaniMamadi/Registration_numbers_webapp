import assert from 'assert'
import registrationApp from '../factory function/registrationApp.js'

describe('registration_numbers', function () {

    it('Should display registration for Cape Town', function () {

        let Registration = registrationApp();
        Registration.setRegistration("CA 98765");

        assert.equal("CA 98765", Registration.getRegistration());

    });

    it('Should display registration for Paarl', function () {

        let Registration = registrationApp();
        Registration.setRegistration("CJ 98765");

        assert.equal("CJ 98765", Registration.getRegistration());

    });

    it('Should display registration for Durban', function () {

        let Registration = registrationApp();
        Registration.setRegistration("ND 98765");

        assert.equal("ND 98765", Registration.getRegistration());


    });

    it('Should display registration for Belville', function () {

        let Registration = registrationApp();
        Registration.setRegistration("CY 230303");

        assert.equal("CY 230303", Registration.getRegistration());

    });

    it('Should give an error message when invalid registration is entered', function () {

        let Registration = registrationApp();
        Registration.setRegistration("BT 32 XN GP");

        assert.equal("Enter valid registration.", Registration.errorMessage());

    });


});