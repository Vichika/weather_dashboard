/**
 * A security issue here, usually for an app that you're posting publicly, not a good idea
 * to expose 3rd party API keys, it requires further setup and a .env file, so you pull in
 * your `API_KEY` as a variable and you don't check in your .env file to source control  
 * I'm sure you'll get into this later in your course. 
 * 
 * Also, following common conventions, constant variables like api keys 
 * that don't change, also known as environment variables, the convention is to use const 
 * and also uppercase snake_case
 *  
 */
const API_KEY = "&appid=11b51103f6079707484ed0b263a1ead5";
const QUERY_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
/**
 * we're not reassigning the value for cityArr here, const makes more sense to use
 * Make sure you read through this
 * https://alligator.io/js/var-let-const/
 *  */ 
const cityArr = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();

$(document).ready(function() {
	const city = cityArr[cityArr.length - 1];
	// only look for a city if one comes up from local storage
	if (cityArr.length > 0) {
		fiveDayForcast(city);
		citySearch(city);
	}
});

function resetValuesInUI() {
	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvIndex").empty();
}

function citySearch(city) {
	resetValuesInUI();
	/**
	 * Use ES6 template strings
	 * https://alligator.io/js/template-literals-es6/
	 * 
	 * */ 
	const citySearch = `${QUERY_URL}${city}${API_KEY}`;
	$.ajax({
		url: citySearch,
		method: "GET"
	})
	.then(response => {
		// Move fill main card logic to its own function
		fillMainCard(response);
		
		/**
		 * Use es6 object destructuring, shorter to type and easier to read
		 * https://alligator.io/js/object-array-destructuring-es2015/
		 */
		const { lon, lat } = response.coord;
		uvIndex(lon, lat);
	});
}

function fillMainCard(obj) {
	const cityInfo = obj.name;
	const dtInfo = obj.dt;
	const currentDt = moment.unix(dtInfo).format("L");
	const iconWeather = obj.weather[0].icon;
	// ES6 template strings
	const iconUrl = `https://openweathermap.org/img/wn/${iconWeather}@2x.png`;
	const iconImg = $("<img>");
	iconImg.attr("src", iconUrl);
	$(".city").append(cityInfo + " ");
	$(".city").append(currentDt + " ");
	$(".city").append(iconImg);
	const K = obj.main.temp;
	const F = ((K - 273.15) * 1.8 + 32).toFixed(0);
	$(".temp").append("Temp: " + F + " \u00B0F");
	const humidityInfo = obj.main.humidity;
	$(".humidity").append(`Humidity: ${humidityInfo}%`);
	const oldSpeed = obj.wind.speed;
	const newSpeed = (oldSpeed * 2.2369).toFixed(2);
	$(".wind").append(`Wind Speed: ${newSpeed} MPH`);
}


function uvIndex(lon, lat) {

	const indexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=11b51103f6079707484ed0b263a1ead5&lat=${lat}&lon=${lon}`;
	
	$.ajax({
		url: indexURL,
		method: "GET"
	})
	.then(response => {
		const uvFinal = response.value;
		$(".uvIndex").append("UV Index: ");
		const uvBtn = $("<button>").text(uvFinal);
		$(".uvIndex").append(uvBtn);
		/**
		 * Switch statements are easier to read than a bunch of if/else's.
		 * Check out this blog on how to use switch statements in JS
		 * https://www.digitalocean.com/community/tutorials/how-to-use-the-switch-statement-in-javascript
		 */
		switch (true) {
			case uvFinal < 3:
				uvBtn.attr("class", "uvGrn");
				break;
			case uvFinal < 6:
				uvBtn.attr("class", "uvYlw");
				break;
			case uvFinal < 8:
				uvBtn.attr("class", "uvOrng");
				break;
			case uvFinal < 11:
				uvBtn.attr("class", "uvRd");
				break;
			default:
				uvBtn.attr("class", "uvPrpl");
		}
	});
}

function renderButtons() {

	$(".list-group").empty();

	for (let i = 0; i < cityArr.length; i++) {

		const li = $("<li>");
		const city = cityArr[i]; 
		/**
		 * jQuery's addClass method can do mutilple classes at a time separated by a space
		 * https://api.jquery.com/addClass/
		 */
		li.addClass("cityName list-group-item");
		li.attr("data-name", city);
		li.text(city);

		$(".list-group").append(li);
	}

	$(".cityName").on("click", (event) => {
		event.preventDefault();

		const city = $(this).data("name");

		fiveDayForcast(city);

		citySearch(city);
	});
}


function dateOnFiveDay(obj, index, dayNum) {
	const formattedDate = moment.unix(obj.list[index].dt).utc().format("L");
	$(`.date${dayNum}`).append(formattedDate);
}

function iconOnFiveDay(obj, index, dayNum) {
	const icon = $("<img>");
	const iconSrc =
		"https://openweathermap.org/img/wn/" +
		obj.list[index].weather[0].icon +
		"@2x.png";
	icon.attr("src", iconSrc);
	$(`.icon${dayNum}`).append(icon);
}

function tempOnFiveDay(obj, indexes, dayNum) {
	$(`.temp${dayNum}`).append("Temp: ");
	$(`.temp${dayNum}`).append(
		tempAvg(
			obj.list[indexes[0]].main.temp,
			obj.list[indexes[1]].main.temp,
			obj.list[indexes[2]].main.temp
		)
	);
	$(`.temp${dayNum}`).append(" °F");
}

function humidityOnFiveDay(obj, indexes, dayNum) {
	$(`.humidity${dayNum}`).append("Humidity: ");
	$(`.humidity${dayNum}`).append(
			humidityAvg(
				obj.list[indexes[0]].main.humidity,
				obj.list[indexes[1]].main.humidity,
				obj.list[indexes[2]].main.humidity
			)
		);
	$(`.humidity${dayNum}`).append("%");
}

function fiveDayForcast(city) {
	const fiveFt = "https://api.openweathermap.org/data/2.5/forecast?q=";
	const fiveURL = fiveFt + city + API_KEY;

	$(".card-text").empty();
	$(".card-title").empty();

	$.ajax({
		url: fiveURL,
		method: "GET"
	}) // es6 arrow functions for these anonymous functions
	.then(response => {
		const wordDayNums = ['One', 'Two', 'Three', 'Four', 'Five'];
		const dateIndexes = [1,9,17,25,33];
		const iconIndexes = [4,12,20,28,36];
		const tempAndHumidtyIndexes = [[2,4,6],[10,12,14], [18,20,22], [26,28,30], [34,36,38]];
		for (let i=0; i<5; i++) {
			const currentDay = wordDayNums[i];
			const currentDate = dateIndexes[i];
			const currentIcon = iconIndexes[i];
			const currentTempHumidity = tempAndHumidtyIndexes[i];
			dateOnFiveDay(response, currentDate, currentDay);
			iconOnFiveDay(response, currentIcon, currentDay);
			tempOnFiveDay(response, currentTempHumidity, currentDay);
			humidityOnFiveDay(response, currentTempHumidity, currentDay);
		}
	});
}

function tempAvg(x, y, z) {
	const avgThree = (x + y + z) / 3.0;
	const avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
	return avgReturn;
}

function humidityAvg(x, y, z) {
	const avgHum = (x + y + z) / 3.0;
	return avgHum.toFixed(0);
}


$("#add-city").on("click", (event) => {
	event.preventDefault();

	const city = $("#city-input").val().trim();

	let containsCity = false;
	/**
	 * Learn array search & filtering methods, they will come in handy
	 * https://alligator.io/js/array-search-methods/
	 */
	if (cityArr != null && cityArr.includes(city)) {
		containsCity = true;
	}

	if (containsCity === false) {
		cityArr.push(city);
	}

	localStorage.setItem("cities", JSON.stringify(cityArr));

	fiveDayForcast(city);
	citySearch(city);
	renderButtons();
});

renderButtons();
