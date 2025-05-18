from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def group_and_super_user_checks(group_names, redirect_url='/'):
    """
    Decorator to restrict access to users in specific groups or super user, redirecting unauthorized users.

    Args:
        group_names (str or list): The group name(s) to check. Can be a string or a list of strings.
        redirect_url (str): The URL to redirect unauthorized users. Defaults to '/'.

    Returns:
        function: The wrapped view function with group access control.
    """
    
    if isinstance(group_names, str):
        group_names = [group_names] 

    def inner(view_func):
        
        @wraps(view_func)
        def _wrapper(request, *args, **kwargs):
            
            if request.user.role_fk.role_name != "Admin" and request.user.role_fk.role_name not in group_names:
                return Response(
                    {"detail": "You do not have permission to access this resource."},
                    status=status.HTTP_403_FORBIDDEN
                )

            return view_func(request, *args, **kwargs)
        
        return _wrapper
    
    return inner