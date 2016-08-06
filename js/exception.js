function DesktopException(err)
{
    MESSAGES.display.error(err.stack);
}

function DesktopWarning(msg)
{
    MESSAGES.display.warning(msg);
}

function DesktopInfo(msg)
{
    MESSAGES.display.info(msg);
}

function DesktopSuccess(msg)
{
    MESSAGES.display.success(msg);
}