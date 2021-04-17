function LIVE_LINE_CHART(){
    return {
        selector: '',
        dataSource:[],
        data:[],
        svg: null,
        mainGroup: null,
        scaleX: null,
        options:{
            legendName:'Value',
            width: 640,
            height: 480,
            margins: {
                top: 20,
                right: 40,
                bottom: 20,
                left: 40,
            },
            MAX_LENGTH:100,
            duration:1000,
            color:'red'
        },

        init: function(el){
            this.selector=el;
            el = d3.select(this.selector);
            if(el.empty()){
                console.warn('Element "'+this.selector+'" not found');
                return;
            }
            this.draw();
        return this;
        },

    
        draw: function(){
            let self = this;  

            if (self.dataSource.length > 30) {
                self.dataSource.shift();
            }

            self.data = [this.options.legendName].map(function(c) {
                return {
                    label: c,
                    values: self.dataSource.map(function(d) {
                        return {
                            time: d.time,
                            value: d.val
                        };
                    })
                };
            });

            let transition = d3.transition().duration(this.options.duration).ease(d3.easeLinear),
                xScale = d3.scaleTime().rangeRound([0, this.options.width-this.options.margins.left-this.options.margins.right]),
                yScale = d3.scaleLinear().rangeRound([this.options.height-this.options.margins.top-this.options.margins.bottom, 0]),
                zScale = d3.scaleOrdinal([this.options.color]);
 
            let xMin = d3.min(self.data, function(c) { return d3.min(c.values, function(d) { return d.time; })});
            let xMax = new Date(new Date(d3.max(self.data, function(c) {
                return d3.max(c.values, function(d) { return d.time; })
            })).getTime() - 2*this.options.duration);
            //})).getTime());

            xScale.domain([xMin, xMax]);
            yScale.domain([
                d3.min(self.data, function(c) { return d3.min(c.values, function(d) { return d.value; })}),
                d3.max(self.data, function(c) { return d3.max(c.values, function(d) { return d.value; })})
            ]);
            zScale.domain(self.data.map(function(c) { return c.label; }));

            let line = d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return xScale(d.time); })
                .y(function(d) { return yScale(d.value); });

            let svg = d3.select(this.selector).selectAll("svg").data([this.data]);
            let gEnter = svg.enter().append("svg")
                .attr("width", this.options.width)
                .attr("height", this.options.height)
                .append("g")
                .attr('transform', 'translate(' + this.options.margins.left + ',' + this.options.margins.top + ')');
            gEnter.append("g").attr("class", "axis x");
            gEnter.append("g").attr("class", "axis y");

            gEnter.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", this.options.width-this.options.margins.left-this.options.margins.right)
                .attr("height", this.options.height-this.options.margins.top-this.options.margins.bottom);

            gEnter.append("g")
                .attr("class", "lines")
                .attr("clip-path", "url(#clip)")
                .selectAll(".data")
                .data(this.data)
                .enter()
                .append("path")
                .attr("class", "data");

            let legendEnter = gEnter.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (this.options.width-this.options.margins.right-this.options.margins.left-75) + ",25)");
            legendEnter.append("rect")
                .attr("width", 50)
                .attr("height", 75)
                .attr("fill", "#ffffff")
                .attr("fill-opacity", 0.2);
            legendEnter.selectAll("text")
                .data(this.data)
                .enter()
                .append("text")
                .attr("y", function(d, i) { return (i*20) + 25; })
                .attr("x", 5)
                .attr("fill", function(d) { return zScale(d.label); });

            let g = svg.select("g");

            g.select("g.axis.x")
                .attr("transform", "translate(0," + (this.options.height-this.options.margins.bottom-this.options.margins.top) + ")")
                .transition(transition)
                .call(d3.axisBottom(xScale).ticks(5));

            g.select("g.axis.y")
                .transition(transition)
                .attr("class", "axis y")
                .call(d3.axisLeft(yScale));

            g.select("defs clipPath rect")
                .transition(transition)
                .attr("width", this.options.width-this.options.margins.left-this.options.margins.right)
                .attr("height", this.options.height-this.options.margins.top-this.options.margins.bottom);

            g.selectAll("g path.data")
                .data(this.data)
                .style("stroke", function(d) { return zScale(d.label); })
                .style("stroke-width", 1)
                .style("fill", "none")
                .transition()
                .duration(this.options.duration)
                .ease(d3.easeLinear)
                .on("start", function(){
                    // Redraw the line.
                    d3.select(this)
                        .attr("d", function(d) { return line(d.values); })
                        .attr("transform", null);
        
                    // Slide it to the left.
                    let xMinLess = new Date(new Date(xMin).getTime() - self.options.duration);
                    d3.active(this)
                        .attr("transform", "translate(" + xScale(xMinLess) + ",0)")
                        .transition();
                });

            g.selectAll("g .legend text")
                .data(this.data)
                .text(function(d) {
                    return d.label.toUpperCase() + ": " + d.values[d.values.length-1].value;
                });
        },
        
    };
}
