const menu = document.getElementById('menu');
function updateMenuSize() {
    const otherMenuStyles = window.getComputedStyle(document.getElementById('othermenu'));
    menu.style.width = otherMenuStyles.width;
    menu.style.height = otherMenuStyles.height;
}
updateMenuSize();
window.addEventListener('resize', updateMenuSize);

var historyCounter = 1;

function addToHistory() {
    var resultValue = document.getElementById("result").innerText;
    var selectedOption = document.getElementById("option").value;
    var key = document.getElementById("key").value;
    var inputText = document.getElementById("inputText").value;

    var newHistoryBlock = document.createElement("div");
    newHistoryBlock.classList.add("history-block");
    newHistoryBlock.setAttribute("data-key", key);
    newHistoryBlock.setAttribute("data-text", inputText);
    newHistoryBlock.setAttribute("data-option", selectedOption);
    newHistoryBlock.setAttribute("onclick", "loadHistory(this)");

    var closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.classList.add("close-button");
    closeButton.setAttribute("onclick", "removeHistory(this, event)");
    newHistoryBlock.insertBefore(closeButton, newHistoryBlock.firstChild);

    var historyEntry = document.createElement("p");

    var textLabel = selectedOption === "encryption" ? "Plaintext" : "Ciphertext";
    var textresult = selectedOption === "encryption" ? "Ciphertext" : "Plaintext";

    historyEntry.innerHTML = "<strong>Caculation #" + historyCounter + "</strong> (" +
        selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1) + ")<br>" +
        "- Key = " + key + "<br>" + "- " + textLabel + " = " + inputText + "<br>" +
        "=> Result " + textresult + " = " + resultValue;

    newHistoryBlock.appendChild(historyEntry);
    var menu = document.getElementById("menu");
    menu.appendChild(newHistoryBlock);

    historyCounter++;
}

function loadHistory(historyBlock) {
    var key = historyBlock.getAttribute("data-key");
    var text = historyBlock.getAttribute("data-text");
    var option = historyBlock.getAttribute("data-option");

    document.getElementById("key").value = key;
    document.getElementById("inputText").value = text;
    document.getElementById("option").value = option;
    changeInputLabel();
}

function removeHistory(closeButton, event) {
    event.stopPropagation();
    event.preventDefault();

    var historyBlock = closeButton.parentElement;
    historyBlock.remove();
}

function clearHistory() {
    var menu = document.getElementById("menu");
    var historyBlocks = menu.getElementsByClassName("history-block");

    while (historyBlocks[0]) {
        historyBlocks[0].parentNode.removeChild(historyBlocks[0]);
    }

    historyCounter = 1;
}

var currentPage = 1;
var totalPages = 19;

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePage();
    }
}

function updatePage() {
    var pageContainer = document.querySelector(".page-container");
    var pageImage = pageContainer.querySelector("img");
    pageImage.src = "Slides/page" + currentPage + ".jpg";

    var currentPageElement = document.getElementById("currentPage");
    currentPageElement.textContent = currentPage;
}

function changeInputLabel() {
    const option = document.getElementById("option").value;
    const inputTextLabel = document.querySelector('label[for="inputText"]');
    const inputText = document.getElementById("inputText");
    const resultText = document.querySelector('label[for="result"]');
    const resultTextExp = document.querySelector('label[for="resultExp"]');

    if (option === "encryption") {
        inputTextLabel.textContent = 'Enter Plaintext:';
        inputText.placeholder = 'Enter 64-bit plaintext (in hex)';
        resultText.textContent = "Result Ciphertext = ";
        resultTextExp.textContent = "Result Ciphertext = ";
        document.getElementById("expTitle").textContent = "Encryption Steps:";
        document.getElementById("result").textContent = "";
        document.getElementById("resultExp").textContent = "";
        document.getElementById('table-container').innerHTML = "Please calculate the result before!";
        document.getElementById('table-container-new').innerHTML = "No result yet!";
    } else if (option === "decryption") {
        inputTextLabel.textContent = 'Enter Ciphertext:';
        inputText.placeholder = 'Enter 64-bit ciphertext (in hex)';
        resultText.textContent = "Result Plaintext = ";
        resultTextExp.textContent = "Result Plaintext = ";
        document.getElementById("expTitle").textContent = "Decryption Steps:";
        document.getElementById("result").textContent = "";
        document.getElementById("resultExp").textContent = "";
        document.getElementById('table-container').innerHTML = "Please calculate the result before!";
        document.getElementById('table-container-new').innerHTML = "No result yet!";
    }

}
function calculateDES() {
    const option = document.getElementById("option").value;

    const key = document.getElementById("key").value;
    const inputText = document.getElementById("inputText").value;

    if (key == "" || inputText == "") {
        alert("Please fill the required fields!");
    } else if (!isHexadecimal(key) || !isHexadecimal(inputText)) {
        alert("Please enter an appropriate input!");
    } else {
        const result = option === "encryption" ? desEncrypt(key, inputText, 0) : desDecrypt(key, inputText, 0);
        document.getElementById("result").textContent = result;
        document.getElementById("resultExp").textContent = result;

        const resultExplanation = option === "encryption" ? desEncrypt(key, inputText, 1) : desDecrypt(key, inputText, 1);
        var rows = resultExplanation.split('\n');
        var tableHTML = '<table>';
        for (var i = 0; i < rows.length; i++) {
            tableHTML += '<tr>';
            var columns = rows[i].split(' ');
            for (var j = 0; j < columns.length; j++) {
                tableHTML += '<td>' + columns[j] + '</td>';
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';
        document.getElementById('table-container').innerHTML = tableHTML;
        document.getElementById('table-container-new').innerHTML = tableHTML;
        addToHistory();
    }
}

function isHexadecimal(input) {
    const hexadecimalPattern = /^[0-9A-F]{16}$/;
    return hexadecimalPattern.test(input);
}

function showExplanation() {
    var explanationModal = document.getElementById("explanationModal");
    explanationModal.style.display = "block";
}

function closeExplanation() {
    var explanationModal = document.getElementById("explanationModal");
    explanationModal.style.display = "none";
}

// Hexadecimal to binary conversion
function hex2bin(s) {
    const mp = {
        '0': "0000",
        '1': "0001",
        '2': "0010",
        '3': "0011",
        '4': "0100",
        '5': "0101",
        '6': "0110",
        '7': "0111",
        '8': "1000",
        '9': "1001",
        'A': "1010",
        'B': "1011",
        'C': "1100",
        'D': "1101",
        'E': "1110",
        'F': "1111"
    };

    let bin = "";
    for (let i = 0; i < s.length; i++) {
        bin += mp[s[i]];
    }
    return bin;
}

// Binary to hexadecimal conversion
function bin2hex(s) {
    const mp = {
        "0000": '0',
        "0001": '1',
        "0010": '2',
        "0011": '3',
        "0100": '4',
        "0101": '5',
        "0110": '6',
        "0111": '7',
        "1000": '8',
        "1001": '9',
        "1010": 'A',
        "1011": 'B',
        "1100": 'C',
        "1101": 'D',
        "1110": 'E',
        "1111": 'F'
    };

    let hex = "";
    for (let i = 0; i < s.length; i += 4) {
        let ch = s.slice(i, i + 4);
        hex += mp[ch];
    }
    return hex;
}

// Binary to decimal conversion
function bin2dec(binary) {
    let decimal = 0;
    let i = 0;
    let n = 0;

    while (binary !== 0) {
        let dec = binary % 10;
        decimal += dec * Math.pow(2, i);
        binary = Math.floor(binary / 10);
        i++;
    }
    return decimal;
}

// Decimal to binary conversion
function dec2bin(num) {
    let res = num.toString(2);
    if (res.length % 4 !== 0) {
        let div = Math.floor(res.length / 4);
        let counter = (4 * (div + 1)) - res.length;
        for (let i = 0; i < counter; i++) {
            res = '0' + res;
        }
    }
    return res;
}

// Permute function to rearrange the bits
function permute(k, arr, n) {
    let permutation = "";
    for (let i = 0; i < n; i++) {
        permutation += k[arr[i] - 1];
    }
    return permutation;
}

// Shifting the bits towards left by nth shifts
function shift_left(k, nth_shifts) {
    let s = "";
    for (let i = 0; i < nth_shifts; i++) {
        for (let j = 1; j < k.length; j++) {
            s += k[j];
        }
        s += k[0];
        k = s;
        s = "";
    }
    return k;
}

// Calculating XOR of two strings of binary numbers a and b
function xor(a, b) {
    let ans = "";
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) {
            ans += "0";
        } else {
            ans += "1";
        }
    }
    return ans;
}

// Table of Position of 64 bits at the initial level: Initial Permutation Table
const initial_perm = [58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7];

// Expansion D-box Table
const exp_d = [32, 1, 2, 3, 4, 5, 4, 5,
    6, 7, 8, 9, 8, 9, 10, 11,
    12, 13, 12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21, 20, 21,
    22, 23, 24, 25, 24, 25, 26, 27,
    28, 29, 28, 29, 30, 31, 32, 1];

// Straight Permutation Table
const per = [16, 7, 20, 21,
    29, 12, 28, 17,
    1, 15, 23, 26,
    5, 18, 31, 10,
    2, 8, 24, 14,
    32, 27, 3, 9,
    19, 13, 30, 6,
    22, 11, 4, 25];

// S-box Table
const sbox = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

// Final Permutation Table
const final_perm = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

// --parity bit drop table
const keyp = [
    57, 49, 41, 33, 25, 17, 9, 1,
    58, 50, 42, 34, 26, 18, 10, 2,
    59, 51, 43, 35, 27, 19, 11, 3,
    60, 52, 44, 36, 63, 55, 47, 39,
    31, 23, 15, 7, 62, 54, 46, 38,
    30, 22, 14, 6, 61, 53, 45, 37,
    29, 21, 13, 5, 28, 20, 12, 4
];

// Number of bit shifts
const shift_table = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// Key- Compression Table: Compression of key from 56 bits to 48 bits
const key_comp = [
    14, 17, 11, 24, 1, 5, 3, 28,
    15, 6, 21, 10, 23, 19, 12, 4,
    26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40,
    51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32
];

function desEncrypt(key, plaintext, condition) {

    // Key generation
    // --hex to binary
    let keyBin = hex2bin(key);

    // Getting 56 bit key from 64 bit using the parity bits
    keyBin = permute(keyBin, keyp, 56);

    // Splitting
    let left_key = keyBin.slice(0, 28); // rkb for RoundKeys in binary
    let right_key = keyBin.slice(28, 56); // rk for RoundKeys in hexadecimal

    let rkb = [];
    let rk = [];
    for (let i = 0; i < 16; i++) {
        // Shifting the bits by nth shifts by checking from shift table
        left_key = shift_left(left_key, shift_table[i]);
        right_key = shift_left(right_key, shift_table[i]);

        // Combination of left and right string
        let combine_str = left_key + right_key;

        // Compression of key from 56 to 48 bits
        let round_key = permute(combine_str, key_comp, 48);

        rkb.push(round_key);
        rk.push(bin2hex(round_key));
    }

    pt = hex2bin(plaintext);

    let returnedResult = "Round " + "Li " + "Ri " + "Ki" + "\n";

    // Initial Permutation
    pt = permute(pt, initial_perm, 64);

    // Splitting
    let left = pt.slice(0, 32);
    let right = pt.slice(32, 64);
    returnedResult += "IP" + " " + bin2hex(left) + " " + bin2hex(right) + " " + "\n";

    for (let i = 0; i < 16; i++) {
        // Expansion D-box: Expanding the 32 bits data into 48 bits
        let right_expanded = permute(right, exp_d, 48);

        // XOR RoundKey[i] and right_expanded
        let xor_x = xor(right_expanded, rkb[i]);

        // S-boxex: substituting the value from s-box table by calculating row and column
        let sbox_str = "";
        for (let j = 0; j < 8; j++) {
            let row = bin2dec(xor_x[j * 6] + xor_x[j * 6 + 5]);
            let col = bin2dec(
                xor_x[j * 6 + 1] + xor_x[j * 6 + 2] + xor_x[j * 6 + 3] + xor_x[j * 6 + 4]
            );
            let val = sbox[j][row][col];
            sbox_str += dec2bin(val);
        }

        // Straight D-box: After substituting rearranging the bits
        sbox_str = permute(sbox_str, per, 32);

        // XOR left and sbox_str
        let result = xor(left, sbox_str);
        left = result;

        // Swapper
        [left, right] = [right, left];
        returnedResult += (i + 1) + " " + bin2hex(left) + " " + bin2hex(right) + " " + rk[i] + "\n";
    }
    //returnedResult = returnedResult.substring(0, returnedResult.length - 2);

    // Combination
    [left, right] = [right, left];
    let combine = left + right;

    // Final permutation: final rearranging of bits to get cipher text
    let cipher_text = permute(combine, final_perm, 64);
    left = cipher_text.slice(0, 32);
    right = cipher_text.slice(32, 64);
    returnedResult += "IP^(-1)" + " " + bin2hex(left) + " " + bin2hex(right) + " ";
    if (condition == 0) {
        return bin2hex(cipher_text);
    }
    return returnedResult;
}

function desDecrypt(key, ciphertext, condition) {

    // Key generation
    // --hex to binary
    let keyBin = hex2bin(key);

    // Getting 56 bit key from 64 bit using the parity bits
    keyBin = permute(keyBin, keyp, 56);

    // Splitting
    let left_key = keyBin.slice(0, 28); // rkb for RoundKeys in binary
    let right_key = keyBin.slice(28, 56); // rk for RoundKeys in hexadecimal

    let rkb = [];
    let rk = [];
    for (let i = 0; i < 16; i++) {
        // Shifting the bits by nth shifts by checking from shift table
        left_key = shift_left(left_key, shift_table[i]);
        right_key = shift_left(right_key, shift_table[i]);

        // Combination of left and right string
        let combine_str = left_key + right_key;

        // Compression of key from 56 to 48 bits
        let round_key = permute(combine_str, key_comp, 48);

        rkb.push(round_key);
        rk.push(bin2hex(round_key));
    }
    let rkb_rev = rkb.slice().reverse();
    let rk_rev = rk.slice().reverse();

    ct = hex2bin(ciphertext);

    let returnedResult = "Round " + "Li " + "Ri " + "Ki" + "\n";

    // Initial Permutation
    ct = permute(ct, initial_perm, 64);

    // Splitting
    let left = ct.slice(0, 32);
    let right = ct.slice(32, 64);
    returnedResult += "IP" + " " + bin2hex(left) + " " + bin2hex(right) + " " + "\n";

    for (let i = 0; i < 16; i++) {
        // Expansion D-box: Expanding the 32 bits data into 48 bits
        let right_expanded = permute(right, exp_d, 48);

        // XOR RoundKey[i] and right_expanded
        let xor_x = xor(right_expanded, rkb_rev[i]);

        // S-boxex: substituting the value from s-box table by calculating row and column
        let sbox_str = "";
        for (let j = 0; j < 8; j++) {
            let row = bin2dec(xor_x[j * 6] + xor_x[j * 6 + 5]);
            let col = bin2dec(
                xor_x[j * 6 + 1] + xor_x[j * 6 + 2] + xor_x[j * 6 + 3] + xor_x[j * 6 + 4]
            );
            let val = sbox[j][row][col];
            sbox_str += dec2bin(val);
        }

        // Straight D-box: After substituting rearranging the bits
        sbox_str = permute(sbox_str, per, 32);

        // XOR left and sbox_str
        let result = xor(left, sbox_str);
        left = result;

        // Swapper
        [left, right] = [right, left];
        returnedResult += (i + 1) + " " + bin2hex(left) + " " + bin2hex(right) + " " + rk_rev[i] + "\n";
    }

    // Combination
    [left, right] = [right, left];
    let combine = left + right;

    // Final permutation: final rearranging of bits to get plain text
    let plain_text = permute(combine, final_perm, 64);
    left = plain_text.slice(0, 32);
    right = plain_text.slice(32, 64);
    returnedResult += "IP^(-1)" + " " + bin2hex(left) + " " + bin2hex(right) + " ";
    if (condition == 0) {
        return bin2hex(plain_text);
    }
    return returnedResult;
}