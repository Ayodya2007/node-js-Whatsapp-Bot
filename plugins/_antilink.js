const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const linkLain = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/g

export async function before(m, { conn, isAdmin, text, isBotAdmin }) {
	if (m.isBaileys && m.fromMe) return !0
	if (!m.isGroup) return !1
	let chat = global.db.data.chats[m.chat]
	const isGroupLink = linkRegex.exec(m.text)
	if (chat.antiLink && isGroupLink && !isAdmin) {
		if (isBotAdmin) {
			const p = await this.groupInviteCode(m.chat)
			const linkThisGroup = `https://chat.whatsapp.com/${p}`
			text = [...m.text.matchAll(linkLain)].map(v => v[1]).filter(v => !v.includes(p))
			if (m.text.includes(linkThisGroup) && text.length == 0) return !0
		}
		if (!m.fromMe && isBotAdmin) await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender } })
		await conn.sendMessage(m.chat, { text: `@${(m.sender || '').replace(/@s\.whatsapp\.net/g, '')} *terdeteksi* mengirim Link Group!`, mentions: [m.sender] }, { quoted: fkontak })
	}
	return !0
}