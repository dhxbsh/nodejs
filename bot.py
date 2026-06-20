import discord
from discord.ext import commands
import os

# ─────────────────────────────────────────
#  ⚙️  Settings — Edit only this section
# ─────────────────────────────────────────
BOT_TOKEN = os.environ.get("BOT_TOKEN", "paste_your_bot_token_here")

SERVICES = {
    "1": (
        "💬 Friendly Reminder\n\n"
        "We don't want many rules, but we want everyone to enjoy their time here.\n"
        "Please follow these simple guidelines:\n\n"
        "• Don't repeat messages in the general chat.\n"
        "• Don't spam or annoy others with mentions.\n"
        "• Don't start arguments with other members.\n\n"
        "We are building a family, not just a clan."
    ),
    "2": (
        "Need Help or Being Teamed On?\n\n"
        "Having trouble in TSB?\n"
        "Message in <#1486393256630554716> if someone is teaming on you or you need help.\n\n"
        "⚡ Our team will respond quickly!\n\n"
        "⚠️ Rules:\n"
        "• Only post about help or teaming issues.\n"
        "• Off-topic messages are not allowed.\n\n"
        "Violations:\n"
        "• 1st - warning\n"
        "• 2nd - warning\n"
        "• 3rd - 30-minute timeout, longer if repeated"
    ),
    "3": (
        "🏆 Ranked Role Info\n\n"
        "This rank is for ranked players.\n"
        "If you want to play 2v2 ranked but don't have a partner, "
        "you can mention this rank in <#1487327256589242469> to find someone to play with."
    ),
    "4": (
        "🛠️ Update Your Info\n\n"
        "If you want to change your Roblox name or have got more kills in TSB "
        "and want it updated in Members, please contact the Owner or Co-Owner."
    ),
}

ROLES = {
    "🏆 Ranked": 1487327460616962078,
    "🤝 Helper": 1486407350444363998,
}

MY_SERVER_ID = 1486045149225029815
# ─────────────────────────────────────────

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)


# ── Services View ────────────────────────
class ServicesView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        for label in SERVICES:
            self.add_item(ServiceButton(label))


class ServiceButton(discord.ui.Button):
    def __init__(self, label: str):
        super().__init__(
            label=label,
            style=discord.ButtonStyle.primary,
            custom_id=f"service_{label}",
        )

    async def callback(self, interaction: discord.Interaction):
        answer = SERVICES.get(self.label, "No information available.")
        embed = discord.Embed(
            title=self.label,
            description=answer,
            color=discord.Color.blurple(),
        )
        embed.set_footer(text="Press another button to view a different service.")
        await interaction.response.send_message(embed=embed, ephemeral=True)


# ── Roles View ───────────────────────────
class RolesView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        for label in ROLES:
            self.add_item(RoleButton(label))


class RoleButton(discord.ui.Button):
    def __init__(self, label: str):
        super().__init__(
            label=label,
            style=discord.ButtonStyle.success,
            custom_id=f"role_{label}",
        )

    async def callback(self, interaction: discord.Interaction):
        role_id = ROLES.get(self.label)
        role = interaction.guild.get_role(role_id)

        if role is None:
            await interaction.response.send_message("❌ Role not found!", ephemeral=True)
            return

        if role in interaction.user.roles:
            await interaction.user.remove_roles(role)
            await interaction.response.send_message(f"❌ Removed **{role.name}**", ephemeral=True)
        else:
            await interaction.user.add_roles(role)
            await interaction.response.send_message(f"✅ You got **{role.name}**!", ephemeral=True)


# ── /menu command ────────────────────────
@bot.tree.command(name="menu", description="Show the services menu")
async def menu(interaction: discord.Interaction):
    embed = discord.Embed(
        title="🗂️ Silent Hell Guide",
        description=(
            "Welcome to SH Clan 👑\n"
            "This menu will help you understand everything in the server.\n\n"
            "📌 Channels → Learn about channels and how to use them\n"
            "👑 Roles → Understand the roles system and how it works\n\n"
            "1 ——> General chat\n"
            "2 ——> Helper chat\n"
            "3 ——> Ranked role\n"
            "4 ——> Update your info\n\n"
            "👉 Click a button below to continue"
        ),
        color=discord.Color.gold(),
    )
    await interaction.response.send_message(embed=embed, view=ServicesView())


# ── /roles command ───────────────────────
@bot.tree.command(name="roles", description="Pick your role")
async def roles(interaction: discord.Interaction):
    embed = discord.Embed(
        title="🎭 Server Roles",
        description="Click a button to get or remove a role! 👇",
        color=discord.Color.green(),
    )
    await interaction.response.send_message(embed=embed, view=RolesView())


# ── On bot ready ─────────────────────────
@bot.event
async def on_ready():
    bot.add_view(ServicesView())
    bot.add_view(RolesView())
    await bot.tree.sync(guild=discord.Object(id=MY_SERVER_ID))
    print(f"✅ Bot is online: {bot.user} | Slash commands synced.")


bot.run(BOT_TOKEN)
