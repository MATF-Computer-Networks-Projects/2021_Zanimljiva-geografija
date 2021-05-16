class Timer {
    constructor(time1) {
        this.time = this.format();
        this.endTime = new Date().getTime() + time1;
        this.timeLeft = this.endTime - new Date().getTime();
    }

    setEndTimeFromServer(time) {
        this.endTime = time;
        this.timeRemaining();
    }

    format() {
        var time = this.timeLeft,
            seconds = Math.floor((time / 1000) % 60),
            minutes = Math.floor((time / (1000 * 60)) % 60),
            hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        var formattedTime = "";
        if (hours > 0 && hours < 10) {
            formattedTime += "0" + hours + ":";
        } else if (hours >= 10) {
            formattedTime += hours + ":";
        }

        if (minutes < 10) {
            formattedTime += "0" + minutes + ":";
        } else {
            formattedTime += minutes + ":";
        }

        if (seconds < 10) {
            formattedTime += "0" + seconds;
        } else {
            formattedTime += seconds;
        }

        return formattedTime;
    }
}

module.exports = Timer;