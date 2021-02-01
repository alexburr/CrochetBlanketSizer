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

const checkSizesArray = function(sizesArray, size) {
    if (size == "large-circle" && sizesArray.length > 0) {
        let index = sizesArray.length;
        if (sizesArray[index - 1] == "large-circle") { size = "small-circle"; }

        if (sizesArray.length > 12) {
            if (sizesArray[index - 11] == "large-circle") { size = "small-circle"; }
            if (sizesArray[index - 12] == "large-circle") { size = "small-circle"; }
            if (sizesArray[index - 13] == "large-circle") { size = "small-circle"; }            
        }
    }

    return size;
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
        { name: "stormBlue", value: "91, 133, 148", displayName: "Storm Blue", numberSmall: 0, numberLarge: 0 },
        { name: "petrol", value: "12, 67, 92", displayName: "Petrol", numberSmall: 0, numberLarge: 0 },
        { name: "tomato", value: "140, 16, 16", displayName: "Tomato", numberSmall: 0, numberLarge: 0 },
        { name: "graphite", value: "65, 64, 66", displayName: "Graphite", numberSmall: 0, numberLarge: 0 },
        { name: "cream", value: "244, 228, 217", displayName: "Cream", numberSmall: 0, numberLarge: 0 },
        { name: "daffodil", value: "251, 220, 150", displayName: "Daffodil", numberSmall: 0, numberLarge: 0 },
        { name: "teal", value: "15, 101, 121", displayName: "Teal", numberSmall: 0, numberLarge: 0 }
    ],
    colorContainerDivId: "colorContainer",
    colorTracker: new ColorTracker(),
    columnsDefault: 12,
    formContainerDivId: "formContainer",
    largeTotal: 0,
    radiusLarge: 10,
    radiusSmall: 5,
    rowsDefault: 20,
    sizesArray: [],
    smallProbability: 0.4,
    smallTotal: 0,
    squareColor: { name: "duckEgg", value: "219, 236, 235", displayName: "Duck Egg" }
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
        let smallSize = (Math.random() < globals.smallProbability);
        let className = (smallSize) ? "small-circle" : "large-circle";
        className = checkSizesArray(globals.sizesArray, className);
        globals.sizesArray.push(className);
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
