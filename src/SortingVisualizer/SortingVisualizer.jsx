import React from "react";
import "./SortingVisualizer.css";

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            speed: 100,
            arrayLength: 20,
            isSorting: false,
        };
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        for (let i = 0; i < this.state.arrayLength; i++) {
            array.push(randomIntFromInterval(1, 400));
        }
        this.setState({ array }, () => {
            const barWidth = Math.min(30, 90 / this.state.arrayLength) + "vw";
            document.documentElement.style.setProperty('--bar-width', barWidth);

            const arrayBars = document.getElementsByClassName('array-bar');
            for (let i = 0; i < arrayBars.length; i++) {
                arrayBars[i].classList.remove('sorted');
            }
        });
    }

    handleSpeedChange = (event) => {
        this.setState({ speed: parseInt(event.target.value) });
    }

    handleArrayLengthChange = (event) => {
        this.setState({ arrayLength: parseInt(event.target.value) }, this.resetArray);
    }

    mergeSort() {
        const animations = [];
        const auxiliaryArray = this.state.array.slice();
        this.mergeSortHelper(this.state.array, 0, this.state.array.length - 1, auxiliaryArray, animations);
        this.animateArray(animations);
    }

    mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        this.mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
        this.mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
        this.doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
    }

    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
        while (i <= middleIdx && j <= endIdx) {
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                animations.push([k, auxiliaryArray[i], "swapping"]);
                mainArray[k++] = auxiliaryArray[i++];
            } else {
                animations.push([k, auxiliaryArray[j], "swapping"]);
                mainArray[k++] = auxiliaryArray[j++];
            }
        }
        while (i <= middleIdx) {
            animations.push([k, auxiliaryArray[i], "swapping"]);
            mainArray[k++] = auxiliaryArray[i++];
        }
        while (j <= endIdx) {
            animations.push([k, auxiliaryArray[j], "swapping"]);
            mainArray[k++] = auxiliaryArray[j++];
        }
    }

    quickSort() {
        const animations = [];
        const array = this.state.array.slice();
        this.quickSortHelper(array, 0, array.length - 1, animations);
        this.animateArray(animations);
    }

    quickSortHelper(array, low, high, animations) {
        if (low < high) {
            const pi = this.partition(array, low, high, animations);
            this.quickSortHelper(array, low, pi - 1, animations);
            this.quickSortHelper(array, pi + 1, high, animations);
        }
    }

    partition(array, low, high, animations) {
        const pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            animations.push([j, array[j], "comparing"]);
            animations.push([high, pivot, "comparing"]);
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                animations.push([i, array[i], "swapping"]);
                animations.push([j, array[j], "swapping"]);
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        animations.push([i + 1, array[i + 1], "swapping"]);
        animations.push([high, array[high], "swapping"]);
        return i + 1;
    }

    heapSort() {
        const animations = [];
        const array = this.state.array.slice();
        const n = array.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(array, n, i, animations);
        }

        for (let i = n - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            animations.push([0, array[0], "swapping"]);
            animations.push([i, array[i], "swapping"]);
            this.heapify(array, i, 0, animations);
        }

        this.animateArray(animations);
    }

    heapify(array, n, i, animations) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && array[left] > array[largest]) {
            largest = left;
        }

        if (right < n && array[right] > array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            [array[i], array[largest]] = [array[largest], array[i]];
            animations.push([i, array[i], "swapping"]);
            animations.push([largest, array[largest], "swapping"]);
            this.heapify(array, n, largest, animations);
        }
    }

    bubbleSort() {
        const animations = [];
        const array = this.state.array.slice();
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                animations.push([j, array[j], "comparing"]);
                animations.push([j + 1, array[j + 1], "comparing"]);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    animations.push([j, array[j], "swapping"]);
                    animations.push([j + 1, array[j + 1], "swapping"]);
                }
            }
        }
        this.animateArray(animations);
    }

    animateArray(animations) {
        this.setState({ isSorting: true });
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const [barOneIdx, newHeight, action] = animations[i];
            const barOneStyle = arrayBars[barOneIdx].style;

            setTimeout(() => {
                arrayBars[barOneIdx].classList.add(action);
                barOneStyle.height = `${newHeight}px`;
            }, i * this.state.speed);

            setTimeout(() => {
                arrayBars[barOneIdx].classList.remove(action);
                if (i === animations.length - 1) {
                    for (let j = 0; j < arrayBars.length; j++) {
                        arrayBars[j].classList.add('sorted');
                    }
                    this.setState({ isSorting: false });
                }
            }, (i + 1) * this.state.speed);
        }
    }

    render() {
        const { array, speed, arrayLength, isSorting } = this.state;
        return (
            <div>
                <div className="controls">
                    <button onClick={() => this.resetArray()} disabled={isSorting}>Generate New Array</button>
                    <button onClick={() => this.mergeSort()} disabled={isSorting}>Merge Sort</button>
                    <button onClick={() => this.quickSort()} disabled={isSorting}>Quick Sort</button>
                    <button onClick={() => this.heapSort()} disabled={isSorting}>Heap Sort</button>
                    <button onClick={() => this.bubbleSort()} disabled={isSorting}>Bubble Sort</button>
                    <div className="adjusters">
                        <label>
                            Speed (ms):
                            <input type="number" value={speed} onChange={this.handleSpeedChange} disabled={isSorting} />
                        </label>
                        <label>
                            Array Length:
                            <input type="number" value={arrayLength} onChange={this.handleArrayLengthChange} disabled={isSorting} />
                        </label>
                    </div>
                </div>
                <div className="array-container">
                    {array.map((value, idx) => (
                        <div className="array-bar"
                            key={idx}
                            style={{ height: `${value}px` }}>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}