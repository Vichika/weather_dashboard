var APIKey = "&appid=11b51103f6079707484ed0b263a1ead5";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var cityArr = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();


$(document).ready(function() {
	var city = cityArr[cityArr.length - 1];
	fiveDay(city);
	citySearch(city);
});



function citySearch(city) {

	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvIndex").empty();

	var citySearch = queryURL + city + APIKey;



	$.ajax({
		url: citySearch,
		method: "GET"
	}).then(function(response) {

		var cityInfo = response.name;


		var dtInfo = response.dt;

		var currentDt = moment.unix(dtInfo).format("L");

		var iconDummy = "https://openweathermap.org/img/wn/";
		var iconPng = "@2x.png";
		var iconWeather = response.weather[0].icon;
		var iconUrl = iconDummy + iconWeather + iconPng;

		var iconImg = $("<img>");
		iconImg.attr("src", iconUrl);
		$(".city").append(cityInfo + " ");
		$(".city").append(currentDt + " ");
		$(".city").append(iconImg);

	
		var K = response.main.temp;

		var F = ((K - 273.15) * 1.8 + 32).toFixed(0);

		$(".temp").append("Temp: " + F + " \u00B0F");

		var humidityInfo = response.main.humidity;
		$(".humidity").append("Humidity: " + humidityInfo + "%");

		var oldSpeed = response.wind.speed;

		var newSpeed = (oldSpeed * 2.2369).toFixed(2);
		$(".wind").append("Wind Speed: " + newSpeed + " MPH");

		var lon = response.coord.lon;
		var lat = response.coord.lat;

		uvIndex(lon, lat);
	});
}


function uvIndex(lon, lat) {

	var indexURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=11b51103f6079707484ed0b263a1ead5&lat=";
	var middle = "&lon=";
	var indexSearch = indexURL + lat + middle + lon;


	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function(response) {
		var uvFinal = response.value;

		$(".uvIndex").append("UV Index: ");
		var uvBtn = $("<button>").text(uvFinal);
		$(".uvIndex").append(uvBtn);
		if (uvFinal < 3) {
			uvBtn.attr("class", "uvGrn");
		} else if (uvFinal < 6) {
			uvBtn.attr("class", "uvYlw");
		} else if (uvFinal < 8) {
			uvBtn.attr("class", "uvOrng");
		} else if (uvFinal < 11) {
			uvBtn.attr("class", "uvRd");
		} else {
			uvBtn.attr("class", "uvPrpl");
		}
	});
}



function renderButtons() {

	$(".list-group").empty();

	for (var i = 0; i < cityArr.length; i++) {

		var a = $("<li>");

		a.addClass("cityName");
		a.addClass("list-group-item");
		a.attr("data-name", cityArr[i]);
		a.text(cityArr[i]);

		$(".list-group").append(a);
	}

	$(".cityName").on("click", function(event) {
		event.preventDefault();

		var city = $(this).data("name");

		fiveDay(city);
		citySearch(city);
	});
}



function fiveDay(city) {
	var fiveFt = "https://api.openweathermap.org/data/2.5/forecast?q=";
	var fiveURL = fiveFt + city + APIKey;


	$(".card-text").empty();
	$(".card-title").empty();

	$.ajax({
		url: fiveURL,
		method: "GET"
	}).then(function(response) {

		var dateOne = moment
			.unix(response.list[1].dt)
			.utc()
			.format("L");
		$(".dateOne").append(dateOne);
		var dateTwo = moment
			.unix(response.list[9].dt)
			.utc()
			.format("L");
		$(".dateTwo").append(dateTwo);
		var dateThree = moment
			.unix(response.list[17].dt)
			.utc()
			.format("L");
		$(".dateThree").append(dateThree);
		var dateFour = moment
			.unix(response.list[25].dt)
			.utc()
			.format("L");
		$(".dateFour").append(dateFour);
		var dateFive = moment
			.unix(response.list[33].dt)
			.utc()
			.format("L");
		$(".dateFive").append(dateFive);

		//icon
		var iconOne = $("<img>");
		var iconOneSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[4].weather[0].icon +
			"@2x.png";

		iconOne.attr("src", iconOneSrc);
		$(".iconOne").append(iconOne);

		var iconTwo = $("<img>");
		var iconTwoSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[12].weather[0].icon +
			"@2x.png";
		iconTwo.attr("src", iconTwoSrc);
		$(".iconTwo").append(iconTwo);

		var iconThree = $("<img>");
		var iconThreeSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[20].weather[0].icon +
			"@2x.png";
		iconThree.attr("src", iconThreeSrc);
		$(".iconThree").append(iconThree);

		var iconFour = $("<img>");
		var iconFourSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[28].weather[0].icon +
			"@2x.png";
		iconFour.attr("src", iconFourSrc);
		$(".iconFour").append(iconFour);

		var iconFive = $("<img>");
		var iconFiveSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[36].weather[0].icon +
			"@2x.png";
		iconFive.attr("src", iconFiveSrc);
		$(".iconFive").append(iconFive);

		//temp
		$(".tempOne").append("Temp: ");
		$(".tempOne").append(
			tempAvg(
				response.list[2].main.temp,
				response.list[4].main.temp,
				response.list[6].main.temp
			)
		);
		$(".tempOne").append(" °F");

		$(".tempTwo").append("Temp: ");
		$(".tempTwo").append(
			tempAvg(
				response.list[10].main.temp,
				response.list[12].main.temp,
				response.list[14].main.temp
			)
		);
		$(".tempTwo").append(" \u00B0F");

		$(".tempThree").append("Temp: ");
		$(".tempThree").append(
			tempAvg(
				response.list[18].main.temp,
				response.list[20].main.temp,
				response.list[22].main.temp
			)
		);
		$(".tempThree").append(" \u00B0F");

		$(".tempFour").append("Temp: ");
		$(".tempFour").append(
			tempAvg(
				response.list[26].main.temp,
				response.list[28].main.temp,
				response.list[30].main.temp
			)
		);
		$(".tempFour").append(" \u00B0F");

		$(".tempFive").append("Temp: ");
		$(".tempFive").append(
			tempAvg(
				response.list[34].main.temp,
				response.list[36].main.temp,
				response.list[38].main.temp
			)
		);
		$(".tempFive").append(" \u00B0F");

		//humidity
		$(".humidityOne").append("Humidity: ");
		$(".humidityOne").append(
			humidityAvg(
				response.list[2].main.humidity,
				response.list[4].main.humidity,
				response.list[6].main.humidity
			)
		);
		$(".humidityOne").append("%");

		$(".humidityTwo").append("Humidity: ");
		$(".humidityTwo").append(
			humidityAvg(
				response.list[10].main.humidity,
				response.list[12].main.humidity,
				response.list[14].main.humidity
			)
		);
		$(".humidityTwo").append("%");

		$(".humidityThree").append("Humidity: ");
		$(".humidityThree").append(
			humidityAvg(
				response.list[18].main.humidity,
				response.list[20].main.humidity,
				response.list[22].main.humidity
			)
		);
		$(".humidityThree").append("%");

		$(".humidityFour").append("Humidity: ");
		$(".humidityFour").append(
			humidityAvg(
				response.list[26].main.humidity,
				response.list[28].main.humidity,
				response.list[30].main.humidity
			)
		);
		$(".humidityFour").append("%");

		$(".humidityFive").append("Humidity: ");
		$(".humidityFive").append(
			humidityAvg(
				response.list[34].main.humidity,
				response.list[36].main.humidity,
				response.list[38].main.humidity
			)
		);
		$(".humidityFive").append("%");
	});
}

function tempAvg(x, y, z) {
	var avgThree = (x + y + z) / 3.0;
	var avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
	return avgReturn;
}

function humidityAvg(x, y, z) {
	var avgHum = (x + y + z) / 3.0;
	return avgHum.toFixed(0);
}


$("#add-city").on("click", function(event) {
	event.preventDefault();


	var city = $("#city-input")
		.val()
		.trim();

	var containsCity = false;

	if (cityArr != null) {
		$(cityArr).each(function(x) {
			if (cityArr[x] === city) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
		cityArr.push(city);
	}


	localStorage.setItem("cities", JSON.stringify(cityArr));

	fiveDay(city);
	citySearch(city);
	renderButtons();
});

renderButtons();
