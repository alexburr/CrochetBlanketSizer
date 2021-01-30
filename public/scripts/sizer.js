// -------------
// SUPPORT CODE
// -------------
const randomColor = function(colors) {
    let min = 0;
    let max = colors.length - 1;

    min = Math.ceil(min);
    max = Math.floor(max);

    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    let color = colors[randomInt];
    color.number++;
    return color;
}

class ColorTracker {
    colors = [];
    colorIndex = 0;

    constructor() {
    }

    init(colors) {
        this.colors = colors;
    }

    getColor() {
        let color = this.colors[this.colorIndex];

        if (this.colorIndex < this.colors.length - 1) {
            this.colorIndex++;
        } else {
            this.colorIndex = 0;
        }
        return(color);
    }
}

// -------------
// GLOBALS
// -------------
const globals = {
    blanketDivId: "blanket",
    blanketPreviewContainerDivId: "blanketPreviewContainer",
    cellsTotal: 0,
    circleColors: [
        { name: "saffron", value: "235, 139, 61", displayName: "Saffron", numberSmall: 0, numberLarge: 0 },
        { name: "daffodil", value: "240, 235, 93", displayName: "Daffodil", numberSmall: 0, numberLarge: 0 },
        { name: "stormBlue", value: "15, 126, 128", displayName: "Storm Blue", numberSmall: 0, numberLarge: 0 },
        { name: "gray", value: "128, 128, 128", displayName: "Gray", numberSmall: 0, numberLarge: 0 },
        { name: "petrol", value: "8, 70, 92", displayName: "Petrol", numberSmall: 0, numberLarge: 0 }
    ],
    colorContainerDivId: "colorContainer",
    colorTracker: new ColorTracker(),
    columnsDefault: 12,
    formContainerDivId: "formContainer",
    largeTotal: 0,
    radiusLarge: 10,
    radiusSmall: 5,
    rowsDefault: 20,
    smallTotal: 0,    
    squareColor: { name: "color6", value: "201, 217, 229", displayName: "Color6" }
};

// ----------------
// REACT COMPONENTS
// ----------------
var ColorTotal = React.createClass({
    render: function() {
        return(
            <div>
            <hr />
            <h4>{this.props.displayName}: {this.props.number}</h4>
            <p>Small: {this.props.numberSmall}, Large: {this.props.numberLarge}</p>
            </div>
        )
    }
})

var ColorEntry = React.createClass({
    render: function() {
        return(
            <div>
                <h6>{this.props.displayName}</h6> 
                <p>Small: {this.props.numberSmall}, Large: {this.props.numberLarge}</p>
            </div>
        )
    }
})

var ColorList = React.createClass({
    render: function() {
        let colorEntries = [];
        let i = 0;

        while (i < this.props.colors.length) {
            colorEntries.push(
                <ColorEntry 
                    key={i} 
                    displayName={this.props.colors[i].displayName} 
                    numberSmall={this.props.colors[i].numberSmall} 
                    numberLarge={this.props.colors[i].numberLarge} />
            );
            i++;
        }
        colorEntries.push(
            <ColorTotal 
            key={99} 
            displayName="Total" 
            number={globals.cellsTotal}
            numberSmall={globals.smallTotal} 
            numberLarge={globals.largeTotal} />
        );

        return (
            <div>{colorEntries}</div>
        )
    }
})

var BlanketCircle = React.createClass({
    render: function() {
        let smallSize = (Math.random() < 0.7); //70% probability of getting true
        let className = (smallSize) ? "small-circle" : "large-circle";
        let circleColor = globals.colorTracker.getColor();// randomColor(globals.circleColors);
        let circleColorValue = circleColor.value;
        let circleBackgroundColor = "rgb(" + circleColorValue + ")";
        globals.cellsTotal++;
        if (smallSize) { circleColor.numberSmall++; globals.smallTotal++ } else { circleColor.numberLarge++; globals.largeTotal++ }
        return (
            <span className={className} style={{ backgroundColor: circleBackgroundColor }} ></span>
        )
    }
})

var BlanketSquare = React.createClass({
    render: function() {
        let squareBackgroundColor = "rgb(" + globals.squareColor.value + ")";
        return (
            <div className="blanket-square" style={{ backgroundColor: squareBackgroundColor }}>
                <BlanketCircle />
            </div>
        )
    }
})

var BlanketRow = React.createClass({
    render: function() {
        let blanketSquares = [];
        let i = 0;

        while (i< this.props.columns) {
            blanketSquares.push(<BlanketSquare key={i} />);
            i++;
        }

        return ( 
            <div className="blanket-row">
                {blanketSquares}
            </div>
        )
    }
});

var Blanket = React.createClass({
    render: function() {
        let blanketRows = [];
        let i = 0;

        while (i < this.props.rows) {
            blanketRows.push(<BlanketRow key={i} colors={this.props.colors} columns={this.props.columns} />);
            i++;
        }

        return ( 
            <div id={globals.blanketDivId}>
                {blanketRows}
            </div>
        )
    }
});

var Form = React.createClass({
    getInitialState: function() {
        return {
            colors: globals.circleColors,
            rows: globals.rowsDefault,
            columns: globals.columnsDefault,
        };
    },
    componentDidMount: function() {
        this.displayResults();
    },
    displayResults: function() {
        ReactDOM.render(
            <ColorList colors={this.state.colors} />, document.getElementById(globals.colorContainerDivId)
        );
    },
    render: function() {
        return (
            <Blanket colors={this.state.colors} rows={this.state.rows} columns={this.state.columns} />
        );
    }
});

// ----------------
// Start the show
// ----------------
globals.colorTracker.init(globals.circleColors);
ReactDOM.render(<Form />, document.getElementById(globals.blanketPreviewContainerDivId));