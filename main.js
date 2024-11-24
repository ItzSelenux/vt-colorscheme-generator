//Created by ItsZariep
const themes =
{
	default: ["#000000", "#aa0000", "#00aa00", "#aa5500", "#0000aa", "#aa00aa", "#00aaaa", "#aaaaaa",
			  "#555555", "#ff5555", "#55ff55", "#ffff55", "#5555ff", "#ff55ff", "#55ffff", "#ffffff"],
	solarized_dark: ["#073642", "#dc322f", "#859900", "#b58900", "#268bd2", "#d33682", "#2aa198", "#eee8d5",
					 "#002b36", "#cb4b16", "#586e75", "#657b83", "#839496", "#6c71c4", "#93a1a1", "#fdf6e3"],
	solarized_light: ["#fdf6e3", "#dc322f", "#859900", "#b58900", "#268bd2", "#d33682", "#2aa198", "#073642",
					  "#eee8d5", "#cb4b16", "#93a1a1", "#839496", "#657b83", "#6c71c4", "#586e75", "#002b36"],
	monokai: ["#272822", "#f92672", "#a6e22e", "#f4bf75", "#66d9ef", "#ae81ff", "#a1efe4", "#f8f8f2",
			  "#75715e", "#fd971f", "#ae81ff", "#a6e22e", "#66d9ef", "#ae81ff", "#a1efe4", "#f9f8f5"],
	dracula: ["#282a36", "#ff79c6", "#50fa7b", "#f1fa8c", "#bd93f9", "#ff5555", "#8be9fd", "#f8f8f2",
			  "#6272a4", "#ff6e6e", "#69ff94", "#ffffa5", "#d6acff", "#ff79c6", "#8be9fd", "#f8f8f2"],
	tokyo_night: ["#1a1b26", "#f7768e", "#9ece6a", "#e0af68", "#7aa2f7", "#bb9af7", "#7dcfff", "#c0caf5",
				  "#6272a4", "#f7768e", "#9ece6a", "#e0af68", "#7aa2f7", "#bb9af7", "#7dcfff", "#c0caf5"],
	gruvbox: ["#282828", "#cc241d", "#98971a", "#d79921", "#458588", "#b16286", "#689d6a", "#a89984",
			  "#928374", "#fb4934", "#b8bb26", "#fabd2f", "#83a598", "#d3869b", "#8ec07c", "#ebdbb2"],
	nord: ["#2e3440", "#bf616a", "#a3be8c", "#ebcb8b", "#81a1c1", "#b48ead", "#88c0d0", "#e5e9f0",
			 "#4c566a", "#bf616a", "#a3be8c", "#ebcb8b", "#81a1c1", "#b48ead", "#8fbcbb", "#eceff4"],
	selenium: ["#2a2a2a", "#a66966", "#91a666", "#a69c66", "#6677a6", "#9a66a6", "#66a6aa", "#a6a6a6",
			   "#666666", "#a66966", "#91a666", "#a69c66", "#6677a6", "#9a66a6", "#66a6aa", "#a6a6a6"]
};

function createPreview()
{
	const colorInputs = document.querySelectorAll('input[type="color"]');
	const coloredBox = document.getElementById('colored-box');
	let colorString = '';
	colorInputs.forEach(input =>
	{
		colorString += `<span class="letter" style="background-color: ${input.value}; color: ${input.value};"> </span>`;
	});

	coloredBox.style.backgroundColor = colorInputs[0].value;
	coloredBox.innerHTML = colorString;
}

function fillColors()
{
	const theme = document.getElementById('themeSelect').value;

	if (theme === "custom")
	{
		customInputContainer.style.display = 'block';
	}
	else
	{
		customInputContainer.style.display = 'none';
	}

	const colors = themes[theme];
	if (colors)
	{
		colors.forEach((color, index) =>
		{
			document.getElementById('color' + index).value = color;
		});
	}
	createPreview()
}

function convertToVT()
{
	const colors = Array.from({ length: 16 }, (_, i) => document.getElementById('color' + i).value.trim());
	const reds = colors.map(color => parseInt(color.substring(1, 3), 16));
	const greens = colors.map(color => parseInt(color.substring(3, 5), 16));
	const blues = colors.map(color => parseInt(color.substring(5, 7), 16));
	const vtFormat = `vt.default_red=${reds.join(',')}\nvt.default_grn=${greens.join(',')}\nvt.default_blu=${blues.join(',')}`;
	document.getElementById('result').textContent = vtFormat;
}

function generateColorList(listtype) {
	const colorInputs = document.querySelectorAll('input[type="color"]');
	let colorString = '';
	const escapeCode = (listtype === 0) ? '\\e' : '\\033';
	const command = (listtype === 0) ? 'echo -en' : 'printf';

	colorInputs.forEach((input, index) => {
		const hex = input.value;
		const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => {
			return r + r + g + g + b + b;
		});
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
		const rgb = result ? {
			r: result[1],
			g: result[2],
			b: result[3]
		} : null;

		const colorIndex = (index < 10) ? index : String.fromCharCode(97 + index - 10);
		colorString += `${command} "${escapeCode}]P${colorIndex}${rgb.r}${rgb.g}${rgb.b}"; `;
	});
	document.getElementById('list').textContent = colorString;
}

function parseVT()
{
	const inputText = document.getElementById('vtInput').value;
	const lines = inputText.split('\n');
	const reds = lines.find(line => line.startsWith('vt.default_red')).split('=')[1].split(',');
	const greens = lines.find(line => line.startsWith('vt.default_grn')).split('=')[1].split(',');
	const blues = lines.find(line => line.startsWith('vt.default_blu')).split('=')[1].split(',');

	if (reds.length !== greens.length || greens.length !== blues.length)
	{
		alert('Error: Invalid format');
		return;
	}

	reds.forEach((red, index) =>
	{
		const r = parseInt(red.trim(), 10).toString(16).padStart(2, '0');
		const g = parseInt(greens[index].trim(), 10).toString(16).padStart(2, '0');
		const b = parseInt(blues[index].trim(), 10).toString(16).padStart(2, '0');
		const hexColor = `#${r}${g}${b}`;
		const colorInput = document.getElementById('color' + index);
		if (colorInput)
		{
			colorInput.value = hexColor;
		}
	});

	createPreview();
}

