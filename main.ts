import { Plugin, MarkdownView, Menu, Editor } from 'obsidian';

const addRubyTag = (editor: Editor, selected: string) => {
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
};

export default class AliasPlugin extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor, view: MarkdownView) => {
				const selectedText = editor.getSelection();
				if (!selectedText || selectedText.trim() === "") {
					return;
				}
				menu.addItem((item) => {
					item.setTitle("Add <ruby> tag")
						.onClick(() => addRubyTag(editor, selectedText));
				});
			})
		);
		this.addCommand({
			id: 'add-ruby',
			name: 'Add <ruby> tag for selected text',
			checkCallback: (checking: boolean) => {
				let view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) {
					return false;
				}
				const editor = view.editor;
				if (!checking) {
					const selected = editor.getSelection();
					addRubyTag(editor, selected);
				}
				return true;
			}
		});
	}

	onunload() {
	}
}
