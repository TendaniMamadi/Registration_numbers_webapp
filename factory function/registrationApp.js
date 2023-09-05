export default function FrontEndLogic() {

    let registration = [];
    let clearMsg = "Database successfully cleared!";
    let city_name = "";


    function addCity(city_code, city_name) {
        if (!city_code) {
            return;
        }

        city_code = city_code.charAt(0).toUpperCase() + city_code.slice(1).toLowerCase();

        if (city_name === "Cape Town") {
            city_code = "CA";
        } else if (city_name === "Polokwane") {
            city_code = "L";
        } else if (city_name === "Durban") {
            city_code = "ND";
        } else if (city_name === "Johannesburg") {
            city_code = "GP";
        }
       
    }



    function setRegistration(plate_number) {
        registration = plate_number
    };


    function getRegistration() {
        return registration
    };


    function setCity(city) {

        city_name = city

    }

    function getCity() {
        return city_name
    }

    function getCityCode() {
        return city_code
    }

    function registrationAdded() {

        return registration.length

    }

    function clearButton() {
        registration.length = 0
    }

    function getClearButton() {
        return registration.length
    }


    function setClearMsg() {
        clearMsg = "Successfully cleared!"
    }

    function getClearMsg() {
        return clearMsg
    }




    return {
        addCity,
        setRegistration,
        getRegistration,
        setCity,
        getCity,
        getCityCode,
      //  errorMessage,
        registrationAdded,
        clearButton,
        getClearButton,
        setClearMsg,
        getClearMsg

    }

}
