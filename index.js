fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(data => data.json())
.then(data => process(data))

const width = 600;
const height = 400;
const padding = {
  top: 20,
  bottom: 40,
  right: 20,
  left: 70
}

d3.select('svg')
  .attr('width', width + padding.left + padding.right)
  .attr('height', height + padding.top + padding.bottom)

function process(data) {
  const parseTime = d3.timeParse('%M:%S')
  const years = data.map( el => el.Year)
  const times = data.map( el => el.Time).map(parseTime)
  
  const xScale = d3.scaleLinear()
    .domain([d3.min(years) - 2, d3.max(years) + 1])
    .range([padding.left, width + padding.left])

  dt_min = 0
  dt_sec = 10 
  const maxMinutes = d3.max(times).getMinutes() + dt_min
  const maxSeconds = d3.max(times).getSeconds() + dt_sec
  const maxTime = parseTime(`${maxMinutes}:${maxSeconds}`)
  const minMinutes = d3.min(times).getMinutes() - dt_min
  const minSeconds = d3.min(times).getSeconds() - dt_sec
  const minTime = parseTime(`${minMinutes}:${minSeconds}`)

  const yScale = d3.scaleTime()
    .domain([minTime, maxTime])
    .range([padding.top + height, padding.top])

  d3.select('svg .plot')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => xScale(years[i]))
    .attr('cy', (d, i) => yScale(times[i]))
    .attr('r', '5px')
    .attr('fill', function(d) {
      if (d['Doping'] === '') {
        return 'goldenrod'
      } else {
        return 'tomato'
      }
    })
    .attr('stroke', 'lightblue')
    // .on('mouseover', function(d) {
    //   d3.select(this)
    //     // .raise()
    //     .attr('transform', 'scale(1.2)')
    // })
    // .on('mouseout', function(d) {
    //   d3.select(this)
    //     // .lower()
    //     .attr('transform', 'scale(1)')
    // })

  const xAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)
    .ticks(5, 'd')

  d3.select('svg .xax')
    .attr('transform', `translate(0, ${padding.top + height})`)
    .call(xAxis)

  const yAxis = d3.axisLeft(yScale)
    .tickSizeOuter(0)
    .ticks(5, '%M:%S')

  d3.select('svg .yax')
    .attr('transform', `translate(${padding.left}, 0)`)
    .call(yAxis)
  
  d3.select('svg .xax')
    .append('text')
    .text('Year')
    .attr('fill', 'black')
    .attr('x', xScale((d3.min(years) + d3.max(years)) / 2))
    .attr('y', 40)
    .style('font-size', '16px')

  d3.select('svg .yax')
    .append('g')
    .attr('transform', `translate(-10, ${(padding.top + (padding.top + height)) / 2})`)
    .append('text')
    .text('Time [mm:ss]')
    .attr('fill', 'black')
    .attr('x', 0)
    // .attr('y', (padding.top + (padding.top + height)) / 2)
    .style('font-size', '16px')
    .attr('transform', `rotate(-90, -50, -10)`)
  
  // console.log(yScale((minTime + maxTime) / 2))
    
}