fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(data => data.json())
.then(data => process(data))

const width = 600;
const height = 400;
const padding = {
  top: 20,
  bottom: 40,
  right: 20,
  left: 40
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
  dt_sec = 20 
  const maxMinutes = d3.max(times).getMinutes() + dt_min
  const maxSeconds = d3.max(times).getSeconds() + dt_sec
  const maxTime = parseTime(`${maxMinutes}:${maxSeconds}`)
  const yScale = d3.scaleTime()
    .domain([d3.min(times), maxTime])
    .range([padding.top + height, padding.top])

  d3.select('svg .plot')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => xScale(years[i]))
    .attr('cy', (d, i) => yScale(times[i]))
    .attr('r', '3px')
    .attr('fill', 'tomato')
    .attr('stroke', 'lightblue')

  const xAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)
    .ticks(5, 'd')

  d3.select('svg .xax')
    .attr('transform', `translate(0, ${padding.top + height + padding.bottom/2})`)
    .call(xAxis)

  const yAxis = d3.axisLeft(yScale)
    .tickSizeOuter(0)
    .ticks(5, '%M:%S')

  d3.select('svg .yax')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)
    .call(yAxis)

}