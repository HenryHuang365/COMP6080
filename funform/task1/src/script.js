let street_name = document.getElementById("street-name");
let form_result = document.getElementById("form-result");
let suburb = document.getElementById("suburb");
let postcode = document.getElementById("postcode");
let dob = document.getElementById("dob");
let building_type = document.getElementById("building-type");
let features_heating = document.getElementById("features-heating");
let features_airconditioning = document.getElementById("features-airconditioning")
let features_pool = document.getElementById("features-pool")
let features_sandpit = document.getElementById("features-sandpit")

let select_all_btn = document.getElementById("select-all-btn")
let reset_form = document.getElementById("reset-form")

const datediff = (dob) => {
    // calculat someone's age
    // reference to https://stackoverflow.com/questions/55836381/how-to-calculate-age-in-javascript-with-the-format-dd-mm-yyyy

    let birth_date  = dob.split("/");
    let new_birth_date = new Date(birth_date[2], birth_date[1] - 1, birth_date[0]);
    // console.log(new_birth_date)
    var diff = new Date() - new_birth_date;
    return Math.floor(diff/31557600000);
}

const text_box = (street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn) => {
    if (street_name.value.length < 3 || street_name.value.length > 50) {
        return "Please input a valid street name";
    }

    if (suburb.value.length < 3 || suburb.value.length > 50) {
        return "Please input a valid suburb";
    }
    
    if (! new RegExp('^[0-9]{4}$').test(postcode.value)) {
        return "Please input a valid postcode";
    }

    if (! new RegExp('^[0-9]{2}/[0-9]{2}/[0-9]{4}$').test(dob.value) || isNaN(new Date(dob.value.split("/")[1] + "/" + dob.value.split("/")[0] + "/" + dob.value.split("/")[2]))) {
        return "Please enter a valid date of birth";
    }

    let type = "an Apartment";
    if (building_type.value === "house") {
        type = "a House";
    } 

    let num_features = 0;
    let features_array = ["Heating","AirConditioning", "Pool", "Sandpit"]
    let feature_index = []
    let features = ""

    if (features_heating.checked) {
        num_features += 1
        feature_index.push(0)
    }

    if (features_airconditioning.checked) {
        num_features += 1
        feature_index.push(1)
    }

    if (features_pool.checked) {
        num_features += 1
        feature_index.push(2)
    }

    if (features_sandpit.checked) {
        num_features += 1
        feature_index.push(3)
    }
    // Sort numbers in ascending order reference to https://www.w3schools.com/jsref/jsref_sort.asp
    feature_index.sort((a, b) => (a-b));

    if (num_features === 0) {
        features = "no features"
        select_all_btn.value = "Select All"
    } else if (num_features === 1) {
        features = features_array[feature_index[0]]
        select_all_btn.value = "Select All"
    } else if (num_features === 2) {
        features = features_array[feature_index[0]] + ", and " + features_array[feature_index[1]]
        select_all_btn.value = "Select All"
    } else if (num_features === 3) {
        features = features_array[feature_index[0]] + ", " + features_array[feature_index[1]] + ", and " + features_array[feature_index[2]]
        select_all_btn.value = "Select All"
    } else if (num_features === 4) {
        features = features_array[feature_index[0]] + ", " + features_array[feature_index[1]] + ", " + features_array[feature_index[2]] + ", and " + features_array[feature_index[3]]
        select_all_btn.value = "Deselect All"
    }


    return "You are " + datediff(dob.value) + " years old, and " 
    + "your address is " + street_name.value + ", " + suburb.value + ", " + postcode.value + ", Australia." 
    + "Your building is " + type + ", and it has " + features;
}

street_name.addEventListener("blur", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})

suburb.addEventListener("blur", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})


postcode.addEventListener("blur", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})


dob.addEventListener("blur", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})


building_type.addEventListener("change", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})


features_heating.addEventListener("click", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})

features_airconditioning.addEventListener("click", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})

features_pool.addEventListener("click", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})

features_sandpit.addEventListener("click", () => {
    form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
})


select_all_btn.addEventListener("click", () => {
    if (select_all_btn.value === "Select All") {        
        features_heating.checked = true;
        features_airconditioning.checked = true;
        features_pool.checked = true;
        features_sandpit.checked = true;
        form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
    } else {
        features_heating.checked = false;
        features_airconditioning.checked = false;
        features_pool.checked = false;
        features_sandpit.checked = false;
        form_result.value = text_box(street_name, suburb, postcode, dob, building_type, features_heating, features_airconditioning, features_pool, features_sandpit, select_all_btn);
    }
})

reset_form.addEventListener("click", () => {
    // select form without using id, reference here: https://stackoverflow.com/questions/32046787/javascript-reduce-function-ternary-operator
    let form = document.getElementsByTagName("form")[0];
    form.reset();
})

