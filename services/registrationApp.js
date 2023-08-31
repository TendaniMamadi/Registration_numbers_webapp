function registrationApp() {
    var plates = [];

    function setDisplayRegistration(registrationNumber) {
        //create empty array to push registration
        //displays the number plate from that city

        let currentPlates = registrationNumber.trim();

        if (currentPlates.startsWith("CA")) {
            plates.push(currentPlates);

        }

        if (currentPlates.endsWith("GP")) {
            plates.push(currentPlates);

        }

        if (currentPlates.startsWith("ND")) {
            plates.push(currentPlates);

        }

        if (currentPlates.endsWith("L")) {
            plates.push(currentPlates);

        }

    }

    function getDisplayRegistration() {

        return plates;
        
    }

   

    function setFilter(city) {
        //function that filters data per city

    }


    return {
        setDisplayRegistration,
        getDisplayRegistration,
        setFilter
    }
}