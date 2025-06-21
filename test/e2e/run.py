from catchingSouls import CatchingSouls

if __name__ == "__main__":
    bot = CatchingSouls()
    bot.land_login_page()
    bot.loginAsRootAdmin()
    bot.logout()
    bot.exit()