import { Plugin, MarkdownView } from 'obsidian';

export default class AliasPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'add-ruby',
			name: 'Add <ruby> tag for selected text',
			checkCallback: (checking: boolean) => {
				let view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) {
					return false;
				}
				const editor = view.sourceMode.cmEditor;
				if (!checking) {
					const selected = editor.getSelection();
					// check whether selected text already in a <ruby> tag.
					const cursor = editor.getCursor();
					const lineText = editor.getLine(cursor.line);
					const rubyTagMatch = lineText.match(/<ruby\>(.*)<\/ruby>/);
					let alreadyInRuby = (
						rubyTagMatch &&
						rubyTagMatch.index &&
						rubyTagMatch.index < cursor.ch &&
						rubyTagMatch.index + rubyTagMatch[0].length > cursor.ch
					);
					let head = `${selected}<rt>`;
					let tail = "</rt>";
					if (!alreadyInRuby) {
						head = `<ruby>${head}`;
						tail = `${tail}</ruby>`;
					}
					editor.replaceSelection(head + tail, "end");
					const { line, ch } = editor.getCursor();
					editor.setCursor({ line, ch: ch - tail.length });
				}
				return true;
			}
		});
	}

	onunload() {
	}
}
