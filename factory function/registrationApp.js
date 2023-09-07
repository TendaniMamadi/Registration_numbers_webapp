export default function FrontEndLogic() {

    let registration = [];
    let clearMsg = "Database successfully cleared!";
    let city = "";

    function addCity(city_code, city) {
        if (!city_code) {
            return city_code; 
        }

        city_code = city_code.charAt(0).toUpperCase() + city_code.slice(1).toLowerCase();

        if (city === "Cape Town") {
            city_code = "CA";
        } else if (city === "Paarl") {
            city_code = "CJ";
        } else if (city === "Durban") {
            city_code = "ND";
        } else if (city === "Bellville") {
            city_code = "CY";
        }

        return city_code; 
    }



    function setRegistration(registration_number) {
        registration = registration_number
    };


    function getRegistration() {
        return registration
    };


    function setCity(city) {

        city = city

    }

    function getCity() {
        return city
    }

    function getCityCode() {
        return city_code
    }

    function getCode(registration) {
        if (registration && typeof registration === 'string' && registration.length >= 2) {
            return registration.substring(0, 2);
        } else {
            
            return 'too short'; 
        }
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

    async function getClearMsg() {
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
        getCode,
        registrationAdded,
        clearButton,
        getClearButton,
        setClearMsg,
        getClearMsg

    }

}

