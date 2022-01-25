function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

// var btn=document.getElementById("sub");
function addElement() {
    let parent = document.querySelector(".objective-detail");
    let name = document.getElementById("obj").value;
    let textDescribe = document.getElementById("describe").value;
    let el = document.createElement("details");
    el.className = "op-4";
    let button = document.querySelector(".btn");
    parent.insertBefore(el, button);
    el.innerHTML = `
    <summary>${name}</summary>
    <div class="objective-content">
        <p>${textDescribe}</p>
    </div>

    <div class="h40">
        <h4>want to add performance indicator </h4>
    </div>
    <div class="form-indicator">
    <form action="">
        <label for="">
            performance indicator
            <!-- <input type="text"> -->
        </label><input type="text"><br><br>
        <label for="meaurment">
            performance measurement
        </label>
        <select id="meaurment">
            <option value="">--Please choose an option--</option>
            <option value="number">number</option>
            <option value="percent">percent</option>
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
        </select><br><br>
        <label for="">
            weight

        </label><input type="number" min="1" max="100"><br><br>
        <label for="">
            minimum Threshold

        </label> <input type="range"><br><br>
        <label for="evaluate">
            Evaluation
        </label>
        <select id="evaluate">
            <option value="">--Please choose an option--</option>
            <option value="need">needs improvement</option>
            <option value="pass">exceeded expectation</option>
        </select><br><br><br>
        <input type="submit" value="add">
    </form>
</div>
    
    `
}