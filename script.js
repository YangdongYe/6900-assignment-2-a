console.log('Homework 2-A...')

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    var data = rows;
    var ndx = crossfilter(data);
    
    var timeExtent2012 = [new Date(2011,12,01),new Date(2012,11,30)];
    var starttime = ndx.dimension(function(d){
        return d.startTime;
    });
    var menber = ndx.dimension(function(d){
        return d.menber;
    });
    var genderMale = ndx.dimension(function(d){
        return d.gender;
    });
    var startStation = ndx.dimension(function(d){
        return d.startStation;
    });
    var duration = ndx.dimension(function(d){
        return d.duration;
    });
    var age = ndx.dimension(function(d){
        if (!d.age) {
            return 'Unknown';
        }else{
            return 2016 - d.age;
        }
    })
    
    //total number of trips in 2012
    
    var trip2012 = starttime.filter([timeExtent2012[0], timeExtent2012[1]]).top(Infinity);
    console.log('The total number of trips in 2012 is '+ trip2012.length);
    
    //total number of trips in 2012 AND taken by male, registered users
    
    trip2012 = genderMale.filter('Male').top(Infinity);
    console.log('The total registered male number of trips in 2012 is '+ trip2012.length);
    
    //total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5). Note that when you apply a new filter on column/dimension A, the existing filters are columns B, C, D... etc. are still active
    
    menber.dispose();
    genderMale.dispose();
    trip2012 = starttime.filter([timeExtent2012[0], timeExtent2012[1]]).top(Infinity);
    trip2012 = startStation.filter('5').top(Infinity);
    console.log('The total number of trips which starts in NEU station in 2012 is '+ trip2012.length);
    
    //top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration. Log the array of these trips in console.
    menber.dispose();
    genderMale.dispose();
    starttime.dispose();
    startStation.dispose();
    
    trip2012 = duration.filterAll().top(50);
    console.log('Top 50 duration of trips shows here: ');
    console.log(trip2012);
    
    //clear all filters
    menber.dispose();
    genderMale.dispose();
    starttime.dispose();
    startStation.dispose();
    duration.dispose();
    
    //trips by users between 20 and 29, 30 and 39 etc.
    var ageGroup = age.group(function(d){
        return Math.floor(d/10)
    });
    console.log('trips by users between 20 and 29, 30 and 39 etc. shows here: ')
    console.log(ageGroup.all());
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        gender: d.gender,
        menber: d.subsc_type,
        age: d.birth_date
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}



