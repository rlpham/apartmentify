const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client();

const GRANARY_ENDPOINT = 'https://thegranaryapts.com/CmsSiteManager/callback.aspx?act=Proxy/GetUnits&available=true&honordisplayorder=true&siteid=7077538&bestprice=true&leaseterm=3&leaseterm=4&leaseterm=5&leaseterm=6&leaseterm=7&leaseterm=8&leaseterm=9&leaseterm=10&leaseterm=11&leaseterm=12&leaseterm=13&dateneeded=2020-09-01&callback=jQuery224000837369546361999_1599014520555&_=1599014520556'

client.login('')

client.on('ready', () => {
    console.log('Ready!')
})

client.on('message', (msg) => {
    if(msg.content.substring(0,1) === `!`) {
        if(msg.content.includes('granary')) {
            var option = parseInt(msg.content.charAt(msg.content.length-1))
            if(option === 1) {
                granary(1, msg);
            } else if(option === 2) {
                granary(2, msg);
            } else if(option === 3) {
                granary(3, msg);
            } else {
                console.log('invalid bedrooms')
            }
        }
    }
})


function granary(bd, msg) {
    axios.get(GRANARY_ENDPOINT)
        .then((response) => {
            
            var data = JSON.parse(response.data.substring(response.data.indexOf('(')+1, response.data.length-1));
            msg.channel.send(new Discord.MessageEmbed()
                .setTitle(`Searching.....`)
                .setTimestamp()
                .setFooter('Developed by Bompton#7777'))
            data.units.forEach((value, index) => {
                if(value.numberOfBeds === bd) {
                    console.log(`${value.floorPlanImages[0].alt.substring(0, value.floorPlanImages[0].alt.indexOf(`:`))}(${value.numberOfBeds}BD ${value.numberOfBaths}BR) / ${value.squareFeet}ft / $${value.rent} / Floor ${value.floorNumber} / Unit ${value.unitNumber}`)
                    sendMessage(value, msg);
                }
            })
            msg.channel.send(new Discord.MessageEmbed()
                .setTitle(`End OF Search`)
                .setTimestamp()
                .setFooter('Developed by Bompton#7777'))
        })
        .catch(err => console.log(err))
}

function sendMessage(value, msg) {
    msg.channel.send(new Discord.MessageEmbed()
        .setColor(`228B22`)
        .setTitle(getTitle(value))
        .setURL(getURL(value, new Date(Date.parse(value.vacantDate))))
        .setThumbnail(getThumbnail(value))
        .addFields(
            {name: 'Bedrooms', value: `${value.numberOfBeds}`, inline: true},
            {name: 'Bathrooms', value: `${value.numberOfBaths}`, inline: true},
            {name: 'Sq Ft', value: `${value.squareFeet}`, inline: true},
            {name: 'Floor', value: `${value.floorNumber}`, inline: true},
            {name: 'Unit', value: `${value.unitNumber}`, inline: true},
            {name: 'Rent', value: `$${value.rent}`, inline: true},
            {name: 'Earliest Move-In Date', value: getEarliestMoveInDate(new Date(Date.parse(value.vacantDate))), inline: true}
        )
        .setTimestamp()
        .setFooter('Developed by Bompton#7777'))
}

function getTitle(value) {
    return value.floorPlanImages[0].alt.substring(0, value.floorPlanImages[0].alt.indexOf(`:`))
}

function getURL(value, date) {
    return `https://www.thegranaryapts.com/OnlineLeasing.aspx?siteid=4362328&MoveInDate=${getEarliestMoveInDate(date)}&LeaseTerm=${value.minLeaseTermInMonth}&UnitId=${value.unitPartnerId}&oll-source-attribution=Google.com&SearchUrl=https://thegranaryapts.com/Floor-plans.aspx`
}

function getThumbnail(value) {
    return `https://capi.myleasestar.com/v2/dimg-crop/${value.floorPlanImages[0].mediaId}/${value.floorPlanImages[0].maxWidth}x${value.floorPlanImages[0].maxHeight}/${value.floorPlanImages[0].mediaId}.jpg`
}

function getEarliestMoveInDate(moveInDate) {
    return `${(moveInDate.getMonth()+1).toString()}/${(moveInDate.getDate()+1).toString()}/${(moveInDate.getFullYear()).toString()}`
}