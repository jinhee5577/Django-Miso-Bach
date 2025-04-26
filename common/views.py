from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import JsonResponse

from common.models import CommCode
from common.froms import UserForm

import requests, json

def signup(request):
    """회원가입 화면으로 이동하고 회원가입 한다.

    Args:
        request (_type_): _description_

    Returns:
        _type_: _description_
    """
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            raw_password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=raw_password) #사용자 인증
            login(request, user) #로그인
            return redirect('/')
    else:
        form = UserForm()
    
    return render(request, 'common/signup.html', {'form':form})
    
def get_comm_code_list(request):
    """공통코드 목록을 조회한다.

    Args:
        request (_type_): _description_

    Returns:
        json: 공통코드 목록
    """
    cl_code = request.GET.get('cl_code')
    
    code_list = CommCode.objects.filter(cl_code = cl_code, use_yn = 'Y').values('code', 'code_nm', 'code_dc')
    
    return JsonResponse({'code_list' : list(code_list)})


def get_comm_post_request(request):
    dic_param = {}
    url = 'https://www.ncbi.nlm.nih.gov/Structure/mmcifparser/mmcifparser.cgi'
    if request.method == "POST":
        for p_name in request.POST:
            dic_param[p_name] = request.POST.get(p_name)

        res = requests.post(url, data=dic_param, verify=False)        

        json_object = json.loads(res.text)

        return JsonResponse( json_object)

def sitemap(request):
    context = {}
    return render(request, 'common/sitemap.html', context)
